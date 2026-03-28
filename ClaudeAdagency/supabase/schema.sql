-- ============================================================
-- Instagram AI Platform — Supabase Schema
-- Run this in the Supabase SQL editor to initialise the DB
-- ============================================================

-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    brand_name       TEXT NOT NULL,
    product_name     TEXT NOT NULL,
    tone             TEXT NOT NULL DEFAULT 'Energetic',
    target_audience  TEXT,
    cta              TEXT,
    image_url        TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending','generating','review','approved','posted','failed')),
    ig_post_id       TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Generated content (one row per project)
CREATE TABLE IF NOT EXISTS content (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    script      TEXT,
    hooks       JSONB,       -- TEXT[]
    shot_list   JSONB,       -- array of {shot, description, duration, camera}
    caption     TEXT,
    hashtags    JSONB,       -- TEXT[]
    voice_url   TEXT,
    video_url   TEXT,        -- raw from Runway / Kling
    final_url   TEXT,        -- merged video (video + voice + subs)
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS content_project_id_idx ON content(project_id);

-- Job tracking
CREATE TABLE IF NOT EXISTS jobs (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    type          TEXT NOT NULL CHECK (type IN ('script','voice','video','merge','post')),
    status        TEXT NOT NULL DEFAULT 'queued'
                    CHECK (status IN ('queued','running','done','failed')),
    provider      TEXT,       -- claude | elevenlabs | runway | ffmpeg | instagram
    external_id   TEXT,       -- provider's async job ID
    result_url    TEXT,
    error         TEXT,
    started_at    TIMESTAMPTZ,
    completed_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS jobs_project_id_idx ON jobs(project_id);

-- Approval log
CREATE TABLE IF NOT EXISTS approvals (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    channel      TEXT NOT NULL DEFAULT 'dashboard' CHECK (channel IN ('whatsapp','dashboard')),
    sent_at      TIMESTAMPTZ,
    approved_at  TIMESTAMPTZ,
    approved_by  TEXT,
    feedback     TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at on projects
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON projects;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Storage bucket (run once manually or via dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true)
-- ON CONFLICT DO NOTHING;
