-- ==========================================
-- 1. Create Profiles Table (for user config)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY, -- Links directly to auth.users if InsForge handles auth like Supabase
  name text,
  avatar_url text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public viewing of profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Allow authenticated users to create/update their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- 2. Create Messages Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  channel text NOT NULL, -- Format: 'chat:main' or 'chat:dm:uuid1:uuid2'
  sender_id uuid REFERENCES public.profiles(id) NOT NULL,
  sender_name text NOT NULL,
  text text NOT NULL,
  status text DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Image/file attachment (nullable; one attachment per message)
  attachment_url text,
  attachment_name text,
  attachment_type text
);

-- Index for querying chat history quickly by channel
CREATE INDEX IF NOT EXISTS messages_channel_idx ON public.messages(channel);

-- Turn on Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view all messages (or restrict to channel logic if needed later)
CREATE POLICY "Messages are viewable by authenticated users" ON public.messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to insert their own messages
CREATE POLICY "Users can insert their own messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Allow users to update their own messages (or status updates)
CREATE POLICY "Users can update messages" ON public.messages
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ==========================================
-- 3. (Optional) Auto-creating Profiles 
-- ==========================================
-- If using Supabase auth mechanism beneath, you can trigger profile creation:
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (new.id, split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on new auth.users insertion
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
