-- Run these THREE lines one at a time in Insforge SQL Editor if the combined ALTER fails.
-- (Run only these; do not paste other SQL from database-schema.sql.)

ALTER TABLE public.messages ADD COLUMN attachment_url text;
ALTER TABLE public.messages ADD COLUMN attachment_name text;
ALTER TABLE public.messages ADD COLUMN attachment_type text;
