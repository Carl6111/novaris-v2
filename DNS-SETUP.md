# lunakris.de einrichten — DNS, Vercel, Clerk

Stand: 29.07.2026

Deine Domain liegt bei **IONOS** (Nameserver `ns1016.ui-dns.de` und drei
weitere `ui-dns.*`). Alle Klickwege unten sind deshalb IONOS-Klickwege.

---

## Wo wir gerade stehen

| | Stand |
|---|---|
| Domain gekauft | ✅ `lunakris.de`, DNS bei IONOS |
| Apex `A @` | ✅ `76.76.21.21` |
| `www` `A` | ✅ `76.76.21.21`, Zertifikat ausgestellt |
| AAAA (Parkseite, IPv6) | ✅ von IONOS mit deaktiviert |
| E-Mail (MX, SPF, DKIM, DMARC) | ✅ unberührt |
| In Vercel eingetragen | ✅ Apex + `www`, Projekt `novaris` |
| Seite live | ✅ Lunakris-Stand ausgeliefert, kein „Novaris" mehr im HTML |
| Clerk Production | ❌ fehlt — **du musst `clerk deploy` ausführen** (Schritt 2) |
| Anmeldung auf lunakris.de | ⏸️ schläft, bis der Production-Key gesetzt ist (Schritt 4) |

**Schritt 1 ist damit erledigt.** Offen sind Schritt 2 bis 4.

---

## Schritt 1 — Die zwei Vercel-Einträge bei IONOS setzen

Das sind die exakten Werte, die Vercel für **dein** Projekt verlangt:

| Typ | Name / Host | Wert | TTL |
|---|---|---|---|
| `A` | `@` (oder leer = die Domain selbst) | `76.76.21.21` | 1 h |
| `A` | `www` | `76.76.21.21` | 1 h |

### ⚠️ Der Fehler, den fast jeder macht

Bei `@` **existiert schon ein A-Eintrag** — `217.160.0.244`, die IONOS-Parkseite.
Den musst du **bearbeiten**, nicht einen zweiten daneben anlegen. Zwei A-Einträge
auf einem Namen heißt: der Browser landet abwechselnd bei Vercel und bei der
Parkseite. Das sieht dann aus wie „die Seite ist manchmal weg" und kostet einen
Abend Fehlersuche.

### Klickweg bei IONOS

1. [ionos.de](https://www.ionos.de) → anmelden
2. Oben **Domains & SSL**
3. In der Liste `lunakris.de` → rechts das Zahnrad → **DNS**
4. In der Tabelle die Zeile **Typ `A`, Name `@`** suchen → Stift-Symbol
5. **Wert** auf `76.76.21.21` ändern → **Speichern**
6. **Eintrag hinzufügen** → Typ `A`, Name `www`, Wert `76.76.21.21` → **Speichern**

### Prüfen (nach ~5–30 Min)

```bash
dig +short A lunakris.de        # muss 76.76.21.21 zeigen
dig +short A www.lunakris.de    # muss 76.76.21.21 zeigen
```

Solange noch `217.160.0.244` kommt, ist die alte Angabe noch im Cache. Abwarten.

---

## Schritt 2 — Clerk Production anlegen (**das machst du**)

Ohne diesen Schritt gibt es die Clerk-DNS-Werte nicht — Clerk erzeugt sie pro
Instanz neu, ich kann sie nicht vorher wissen. Und `clerk deploy` verlangt ein
echtes Terminal, ich kann es nicht für dich starten.

**Terminal öffnen und ausführen:**

```bash
cd ~/Downloads/lunakris-v2
~/.hermes/node/bin/clerk deploy
```

Es fragt nach der Domain → **`lunakris.de`** eingeben.

Danach sag mir Bescheid. Ich hole mit `clerk deploy status` die erzeugten
Einträge und trage sie unten in die Tabelle ein.

### Was dabei herauskommt (Platzhalter, bis du deployt hast)

| Typ | Name / Host | Wert | Zweck |
|---|---|---|---|
| `CNAME` | `clerk` | _wird nach `clerk deploy` eingetragen_ | Frontend-API |
| `CNAME` | `accounts` | _dito_ | Konto-Seiten |
| `CNAME` | `clkmail` | _dito_ | Mailversand |
| `CNAME` | `clk._domainkey` | _dito_ | DKIM-Signatur |
| `CNAME` | `clk2._domainkey` | _dito_ | DKIM-Signatur |

Diese kommen genauso in die IONOS-DNS-Tabelle wie in Schritt 1 — nur eben als
Typ `CNAME` statt `A`.

**Wichtig:** Bei einem CNAME trägt IONOS den Zielwert manchmal ohne
abschließenden Punkt ein. Das ist in Ordnung. Trag den Wert genau so ein, wie
Clerk ihn nennt, ohne eigene Ergänzungen.

DNS-Verbreitung dauert meist Minuten, laut Clerk im Extremfall bis 48 Stunden.
Clerk prüft selbstständig nach und schaltet dann frei.

---

## Schritt 3 — Eigene Google-Zugangsdaten

In der Entwicklungs-Instanz nutzt Clerk geteilte Google-Zugangsdaten. In
Production geht das nicht mehr — und der Google-Zustimmungsdialog soll
„Lunakris" sagen, nicht „Clerk".

1. [console.cloud.google.com](https://console.cloud.google.com) → Projekt anlegen (Name: `Lunakris`)
2. **APIs & Dienste → OAuth-Zustimmungsbildschirm** → Extern → App-Name `Lunakris`, Support-Mail eintragen
3. **Anmeldedaten → Anmeldedaten erstellen → OAuth-Client-ID** → Webanwendung
4. Bei **Autorisierte Weiterleitungs-URIs** den Wert eintragen, den Clerk im
   Dashboard unter *SSO Connections → Google* anzeigt (etwa
   `https://clerk.lunakris.de/v1/oauth_callback`)
5. Client-ID und Client-Secret zurück ins Clerk-Dashboard bei Google eintragen

---

## Schritt 4 — Production-Key in Vercel

`clerk deploy` erzeugt einen Production-Publishable-Key (`pk_live_…`).

```bash
cd ~/Downloads/lunakris-v2
vercel env add VITE_CLERK_PUBLISHABLE_KEY production
# Key einfügen, Enter
```

Oder im Vercel-Dashboard: Projekt → **Settings → Environment Variables** →
Name `VITE_CLERK_PUBLISHABLE_KEY`, Scope **Production**.

Danach neu deployen, sonst greift die Variable nicht:

```bash
vercel --prod
```

**Ohne diesen Key läuft die Seite trotzdem** — nur ohne Anmeldung. `/login` und
`/portal` sagen dann selbst, dass die Anmeldung noch nicht eingerichtet ist,
und die Formulare sind wieder frei benutzbar. Das ist Absicht: ein vergessener
Env-Var darf nicht die ganze Website abschießen.

---

## Schritt 5 — Kontrolle

```bash
dig +short A lunakris.de                    # 76.76.21.21
dig +short CNAME clerk.lunakris.de          # Clerk-Ziel
vercel domains inspect lunakris.de          # "Configured"
~/.hermes/node/bin/clerk deploy status      # complete: true
```

Im Browser: `https://lunakris.de` → Intro-Film → oben rechts **Anmelden** →
das Fenster darf **keinen** orangen „Development mode"-Hinweis mehr zeigen.

---

## Was danach noch offen bleibt

- **Apple Sign In** braucht das Apple Developer Program (99 €/Jahr). Ohne das
  bleiben im Anmeldefenster Google, E-Mail+Passwort und Magic Link.
- **Alte URLs**: `novaris-ecru.vercel.app` bleibt vorerst erreichbar. Wenn sie
  weg soll, im Vercel-Dashboard unter Domains entfernen — vorher prüfen, ob sie
  irgendwo verlinkt ist.
- **GitHub-Repo und Vercel-Projekt** heißen weiter `novaris`. Nach außen ist das
  nur in der Repo-URL sichtbar, nicht auf der Website. Umbenennen geht
  jederzeit, bricht aber alte Deploy-Links.
