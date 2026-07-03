-- ============================================================
-- Club 404 AU — Supabase Schema for Role-Based Auth
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Create custom enum for user roles
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'moderator', 'member');

-- 2. Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role user_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create access_requests table
CREATE TABLE public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  requested_role user_role NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- 5. Profiles policies
-- Anyone can read profiles (role badges are public)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can update any profile (for role changes)
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- 6. Access requests policies
-- Users can view their own requests
CREATE POLICY "Users can view own access requests"
  ON public.access_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Admins and moderators can view all pending requests
CREATE POLICY "Admins can view all access requests"
  ON public.access_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'moderator')
    )
  );

-- Authenticated users can create access requests
CREATE POLICY "Authenticated users can create access requests"
  ON public.access_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can update access requests (approve/reject)
CREATE POLICY "Admins can update access requests"
  ON public.access_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'moderator')
    )
  );

-- 7. Auto-create profile on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Function to auto-assign super_admin to first user
CREATE OR REPLACE FUNCTION public.assign_first_super_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.profiles) = 1 THEN
    UPDATE public.profiles SET role = 'super_admin' WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_first_user_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.assign_first_super_admin();

-- 9. Indexes for performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_access_requests_status ON public.access_requests(status);
CREATE INDEX idx_access_requests_user_id ON public.access_requests(user_id);

-- ============================================================
-- SETUP INSTRUCTIONS:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Paste this entire script and run it
-- 3. Go to Authentication > Providers
-- 4. Enable GitHub provider (create OAuth app in GitHub Settings > Developer settings > OAuth Apps)
-- 5. Enable Google provider (create OAuth client in Google Cloud Console > APIs & Services > Credentials)
-- 6. Set Site URL in Authentication > URL Configuration to your deployed URL
-- 7. Add http://localhost:8080 to Redirect URLs in Authentication > URL Configuration
-- ============================================================
