-- ============================================================
-- prospects — Kaltakquise-Liste aus LeadScout
--
-- War in DATENBANK.md dokumentiert, aber nie angelegt (Stand 2026-07-31).
-- Ziel von `leadscout run --supabase`.
-- Ausführen im Supabase SQL Editor.
-- ============================================================

create table if not exists public.prospects (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),

  -- Kennung aus LeadScout ("linkedin/<slug>", Google-Place-Id oder "web/<host>").
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

create index if not exists prospects_budget_idx  on public.prospects (budget_score desc);
create index if not exists prospects_status_idx  on public.prospects (status);
create index if not exists prospects_segment_idx on public.prospects (segment);

-- Gleiche Regel wie bei leads: RLS an, keine Policies. Der öffentliche
-- anon-Key kommt an gar nichts, jeder Zugriff läuft über /api/prospects
-- bzw. den LeadScout-Sink mit dem Service-Key.
alter table public.prospects enable row level security;
