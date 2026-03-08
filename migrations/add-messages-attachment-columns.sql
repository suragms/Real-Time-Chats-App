-- Add image/file attachment columns to messages table (Insforge / Postgres)
-- Run ONLY this file in Insforge SQL Editor (do not mix with CREATE TABLE or other statements).

-- Option A: One statement (Postgres 9.5+)
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS attachment_url text,
  ADD COLUMN IF NOT EXISTS attachment_name text,
  ADD COLUMN IF NOT EXISTS attachment_type text;

-- If Option A fails, run Option B instead (one column per statement):
-- ALTER TABLE public.messages ADD COLUMN attachment_url text;
-- ALTER TABLE public.messages ADD COLUMN attachment_name text;
-- ALTER TABLE public.messages ADD COLUMN attachment_type text;
