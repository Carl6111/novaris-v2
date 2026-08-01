# Lead-Datenbank einrichten

Die Anfragen aus dem Buchungs-Wizard landen ab jetzt in einer echten Datenbank,
nicht mehr nur in einer E-Mail. Diese Anleitung richtet sie ein.

Dauer: ~10 Minuten. Danach steht `/admin`.

---

## 1. Supabase-Projekt anlegen

1. [supabase.com](https://supabase.com) → anmelden → **New Project**
2. Name: `lunakris`
3. **Region: `Central EU (Frankfurt)`** — die Preise-Seite und die
   Datenschutz-Seite versprechen beide EU-Hosting. Eine andere Region macht
   beide Aussagen falsch.
4. Datenbank-Passwort erzeugen und **im Passwortmanager sichern**. Du brauchst
   es für diese Anleitung nicht, aber ohne kommst du später nicht mehr an die
   Datenbank direkt heran.

---

## 2. Tabelle anlegen

Supabase-Dashboard → **SQL Editor** → **New query** → das hier einfügen → **Run**:

```sql
create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  quelle        text        not null,
  name          text        not null,
  email         text        not null,
  firma         text,
  thema         text[]      not null default '{}',
  teamgroesse   text,
  zeitleck      text,
  tier          text,
  base_id       text,
  addon_ids     text[]      not null default '{}',
  setup_text    text,
  clerk_user_id text,
  status        text        not null default 'neu',
  notiz         text
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx     on public.leads (status);

-- Row Level Security an, aber ohne Policies.
-- Das ist Absicht: der oeffentliche anon-Key kommt damit an gar nichts.
-- Jeder Zugriff laeuft ueber die Serverfunktionen in /api mit dem
-- Service-Key, der den Browser nie erreicht.
alter table public.leads enable row level security;
```

Danach unter **Table Editor** nachsehen: `leads` steht da, mit einem
Schloss-Symbol für RLS.

---

## 3. Drei Werte in Vercel eintragen

Vercel-Dashboard → Projekt → **Settings → Environment Variables**.
Scope jeweils **Production** *und* **Preview** ankreuzen.

| Name | Woher |
|---|---|
| `SUPABASE_URL` | Supabase → *Project Settings → Data API* → **Project URL** |
| `SUPABASE_SERVICE_ROLE_KEY` | dieselbe Seite → **service_role** |
| `CLERK_SECRET_KEY` | Clerk-Dashboard → *API Keys* → **Secret Key** |

### ⚠️ Zum service_role-Key

Der Key hebelt Row Level Security aus. Wer ihn hat, hat die ganze Datenbank —
lesen, ändern, löschen. Deshalb:

- **nicht** ins Projekt kopieren
- **nicht** in einen Chat, auch nicht an mich
- **nicht** auf einen Screenshot
- **kein** `VITE_`-Präfix davor. Alles mit diesem Präfix backt Vite in das
  JavaScript, das jeder Besucher herunterlädt.

Falls er doch mal irgendwo auftaucht: Supabase → *Project Settings → Data API*
→ **Reset**. Danach den neuen Wert in Vercel eintragen.

---

## 4. Lokal entwickeln

Dieselben drei Werte in `.env.local` im Projektordner. Die Datei steht in
`.gitignore` und wird nie committet.

```
SUPABASE_URL=…
SUPABASE_SERVICE_ROLE_KEY=…
CLERK_SECRET_KEY=…
```

`npm run dev` bedient allerdings **kein** `/api` — Vite kennt Vercel-Funktionen
nicht. Zum Testen der Endpunkte:

```bash
npx vercel dev
```

---

## 5. Deployen

```bash
git push
```

Die Variablen greifen erst beim nächsten Deploy. Fehlt eine, antwortet
`/api/leads` mit 500 und das Formular zeigt dem Besucher einen ehrlichen
Fehler statt eines Erfolgsbildschirms.

---

## Was danach wo liegt

| | |
|---|---|
| Datensatz | Supabase, Tabelle `leads` |
| Benachrichtigung | Web3Forms → deine Mail (unverändert) |
| Ansicht | `lunakris.de/admin`, nur mit `role: admin` |
| Export | Knopf **CSV** in der Werkzeugleiste |

Die Admin-Rolle hängt an deinem Clerk-Konto unter *Public Metadata*:

```json
{ "role": "admin" }
```

Ohne diesen Eintrag antwortet `/api/leads` mit **404** — bewusst nicht 403:
eine Route, deren Existenz man nicht bestätigt bekommt, wird auch nicht
abgeklopft.

---

# Zielkunden-Tabelle (`/admin/prospects`)

Die zweite Richtung: nicht wer sich gemeldet hat, sondern wen wir uns
ausgesucht haben. Die Daten kommen aus LeadScout (`~/Downloads/leadscout`).

Eigene Tabelle statt einer Spalte in `leads` — die Felder überschneiden sich
kaum, und ein Statuswechsel bedeutet hier etwas anderes.

## Tabelle anlegen

Supabase → **SQL Editor** → **New query** → einfügen → **Run**:

```sql
create table public.prospects (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),

  -- Kennung aus LeadScout ("linkedin/<slug>" oder die Google-Place-Id).
  -- Eindeutig, damit ein zweiter Import aktualisiert statt verdoppelt.
  extern_id           text        not null unique,
  segment             text,

  firma               text        not null,
  rechtsform          text,
  strasse             text,
  plz                 text,
  ort                 text,

  telefon             text,
  telefon_e164        text,
  email               text,
  website             text,

  entscheider         text,
  entscheider_rolle   text,
  entscheider_telefon text,
  entscheider_email   text,
  entscheider_quelle  text,

  mitarbeiter         text,
  linkedin_mitglieder integer,
  offene_stellen      integer,
  karriereseite       text,
  hrb                 text,
  linkedin            text,
  maps_url            text,
  branche             text,

  lead_score          integer     not null default 0,
  budget_score        integer     not null default 0,
  budget_begruendung  text,
  score_begruendung   text,
  quellen             text,
  erhoben_am          text,

  status              text        not null default 'offen',
  notiz               text
);

create index prospects_budget_idx  on public.prospects (budget_score desc);
create index prospects_status_idx  on public.prospects (status);
create index prospects_segment_idx on public.prospects (segment);

-- Gleiche Regel wie bei leads: RLS an, keine Policies. Der öffentliche
-- anon-Key kommt an gar nichts, jeder Zugriff läuft über /api/prospects
-- mit dem Service-Key.
alter table public.prospects enable row level security;
```

## Leads einspielen

1. LeadScout laufen lassen, z. B.
   `leadscout run --segment b2b-software --limit 200 --budget 3.00`
2. `lunakris.de/admin/prospects` öffnen
3. Oben rechts die gewünschte Schwelle wählen (**Budget belegt** = 50)
4. **LeadScout-JSON** klicken und die `.json` aus `leadscout/leads/` hochladen

Alles unterhalb der Schwelle wird **gar nicht erst gespeichert**. Die Meldung
nach dem Import nennt, wie viele übernommen und wie viele aussortiert wurden.

Ein erneuter Import derselben Datei aktualisiert die Datensätze. **Status und
Notiz bleiben dabei stehen** — die hast du von Hand gesetzt, die überschreibt
kein Import.

## Statuswerte

`offen` → `angerufen` → `termin` → `kunde`, oder `kein_interesse`.

---

# Zugang auf ein einziges Konto begrenzen

Ab jetzt reicht die Admin-Rolle **nicht mehr allein**. Der Server prüft
zusätzlich, ob die Clerk-Nutzer-Id auf einer Liste steht, die nur über die
Vercel-Umgebungsvariablen zu ändern ist.

Warum zwei Freigaben:

| Freigabe | wer sie ändern kann |
|---|---|
| `publicMetadata.role` | jeder mit Clerk-Dashboard-Zugang oder dem Secret Key |
| `ADMIN_USER_IDS` | nur wer Zugriff auf das Vercel-Projekt hat |

Wer nur eine der beiden Stellen kontrolliert, kommt nicht rein.

## Einrichten

**1. Deine Clerk-Nutzer-Id holen**

Clerk-Dashboard → **Users** → dein Konto anklicken → oben steht die Id in der
Form `user_2abcDEF...`. Kopieren.

**2. In Vercel hinterlegen**

Vercel-Projekt → **Settings** → **Environment Variables** → neu:

```
ADMIN_USER_IDS = user_2abcDEF...
```

Für alle Umgebungen setzen (Production, Preview, Development). Mehrere Konten
später: durch Komma trennen, `user_aaa,user_bbb`.

**3. Neu deployen**

Umgebungsvariablen greifen erst beim nächsten Deploy.

## Wichtig

Ist `ADMIN_USER_IDS` **nicht gesetzt, kommt niemand rein** — auch du nicht.
Das ist Absicht: eine vergessene Konfiguration darf nie zu offenem Zugang
werden. Im Vercel-Log steht dann in Klartext, was fehlt.

## Lokal entwickeln

In der `.env.local` dieselbe Zeile ergänzen, sonst antwortet `/api/prospects`
auch auf dem eigenen Rechner mit 404.

## Zugang wieder entziehen

Zwei Wege, beide wirken sofort:

- **Schnell, ohne Deploy:** in Clerk die `role` aus den Public Metadata löschen
- **Endgültig:** die Id aus `ADMIN_USER_IDS` streichen und neu deployen
