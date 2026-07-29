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
