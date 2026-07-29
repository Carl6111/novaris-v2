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

### Die echten Werte (Production-Instanz `ins_3H9ZBbti4vb29eL4o9z7ZdSn3jK`)

| Typ | Name / Host | Wert | Zweck |
|---|---|---|---|
| `CNAME` | `clerk` | `frontend-api.clerk.services` | Frontend-API — **hiervon lädt die Anmeldung ihr JavaScript** |
| `CNAME` | `accounts` | `accounts.clerk.services` | Konto-Seiten |
| `CNAME` | `clkmail` | `mail.nfu6jvilqce0.clerk.services` | Mailversand |
| `CNAME` | `clk._domainkey` | `dkim1.nfu6jvilqce0.clerk.services` | DKIM-Signatur |
| `CNAME` | `clk2._domainkey` | `dkim2.nfu6jvilqce0.clerk.services` | DKIM-Signatur |

Keiner kollidiert mit deinen bestehenden Einträgen. Die IONOS-DKIM-Einträge
heißen `s1-ionos._domainkey` / `s2-ionos._domainkey`, die neuen `clk.` und
`clk2.` — die stehen nebeneinander.

Diese kommen genauso in die IONOS-DNS-Tabelle wie in Schritt 1 — nur eben als
Typ `CNAME` statt `A`.

**Wichtig:** Bei einem CNAME trägt IONOS den Zielwert manchmal ohne
abschließenden Punkt ein. Das ist in Ordnung. Trag den Wert genau so ein, wie
Clerk ihn nennt, ohne eigene Ergänzungen.

DNS-Verbreitung dauert meist Minuten, laut Clerk im Extremfall bis 48 Stunden.
Clerk prüft selbstständig nach und schaltet dann frei.

---

## Schritt 3 — Eigene Google-Zugangsdaten (optional)

**Stand: Google ist auf der Production-Instanz abgeschaltet.** In der
Entwicklungs-Instanz lief er über Clerks geteilte Zugangsdaten; die sind in
Production gesperrt. Der Knopf war kurz live und lief in
`Error 400: invalid_request — Missing required parameter: client_id`.
Deshalb aus. E-Mail+Passwort und Magic Link laufen unabhängig davon.

### Der wichtigste Punkt zuerst: Freigabestatus

Aus [Clerks Doku](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/google):

> *„To switch a Google OAuth app to production, you must set the publishing
> status to **In production**. This involves a verification process."*

Neue Google-Apps stehen auf **„Testing"** — begrenzt auf **100 Testnutzer**,
die einzeln eingetragen werden. Für „In production" prüft Google App-Name,
Logo und Scopes; das dauert.

**Für den Anfang reicht „Testing".** Pilotkunden als Testnutzer eintragen,
fertig. Die Verifizierung braucht es erst, wenn Fremde sich selbst anmelden.

### Ablauf

1. **Zuerst die URI holen:** Clerk-Dashboard → **SSO connections** →
   *Add connection* → *For all users* → **Google**. Dort steht die
   **Authorized Redirect URI**. Kopieren — nicht selbst zusammenbauen.
2. [console.cloud.google.com](https://console.cloud.google.com) → Projekt `Lunakris` anlegen
3. **APIs & Dienste → OAuth-Zustimmungsbildschirm** → Nutzertyp **Extern**,
   App-Name `Lunakris`, Support- und Entwicklerkontakt eintragen
4. **Anmeldedaten → Anmeldedaten erstellen → OAuth-Client-ID** →
   Anwendungstyp **Webanwendung**
   - **Autorisierte JavaScript-Quellen:** `https://lunakris.de` und
     `http://localhost:5173`
   - **Autorisierte Weiterleitungs-URIs:** der Wert aus Schritt 1
5. **Client-ID** und **Client-Secret** zurück ins Clerk-Dashboard bei Google
   unter *Use custom credentials* → **Save**. Das schaltet Google zugleich
   wieder ein.

### Fallen

- **Client-Secret ist nur einmal sichtbar.** Sofort kopieren. Es gehört ins
  Clerk-Dashboard, **nicht** in dieses Projekt.
- **Kein WebView:** *„Google OAuth 2.0 does not allow apps to use WebViews for
  authentication."* Betrifft In-App-Browser, etwa Links aus Instagram oder
  LinkedIn — dort schlägt Google-Anmeldung fehl, E-Mail+Passwort nicht.
- **E-Mail-Subadressen** mit `+`, `=` oder `#` blockiert Clerk standardmäßig
  (`block_email_subaddresses`). Beim Testen mit `name+test@…` also normal.

---

## Schritt 4 — Production-Key in Vercel

✅ **Schon erledigt.** `VITE_CLERK_PUBLISHABLE_KEY` = `pk_live_Y2xlcmsubHVuYWtyaXMuZGUk`
liegt in Vercel unter Scope *Production*.

### ⚠️ Aber: erst deployen, wenn `clerk.lunakris.de` auflöst

Die Variable greift erst beim nächsten Deploy — und der darf **nicht** vor den
CNAMEs laufen. Grund: Clerk lädt sein JavaScript von `clerk.lunakris.de`.
Fehlt der Eintrag, ist der Key zwar gesetzt (die Seite hält die Anmeldung
damit für eingerichtet), aber Clerk kann nicht laden. Ergebnis: der
Anmelden-Knopf erscheint und tut nichts, und die Formulare sind gesperrt ohne
Anmeldemöglichkeit. Das ist schlechter als der Zustand ohne Key.

Prüfen, dann deployen:

```bash
dig +short CNAME clerk.lunakris.de     # muss frontend-api.clerk.services zeigen
~/.hermes/node/bin/clerk deploy status # domainStatus dns/ssl: "verified"
git commit --allow-empty -m "chore: Deploy mit Clerk-Production-Key" && git push
```

**Deploy immer über `git push`, nicht über `vercel --prod`.** Aus dem
Deployment-Protokoll von Praxis Stärke & Staack: wiederholte CLI-Deploys haben
dort schon einmal den Vercel-Account gesperrt.

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
