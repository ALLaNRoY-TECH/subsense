-- SQL Schema Setup for SubSense Database in Supabase
-- Paste these commands into the SQL Editor of your Supabase Project

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY, -- Maps to Google user ID or email
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    google_access_token TEXT,
    google_refresh_token TEXT,
    token_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT '₹' NOT NULL,
    category TEXT DEFAULT 'Entertainment' NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'wasting', 'duplicate'
    last_used TEXT,
    billing_date TEXT,
    renewal_date TIMESTAMP WITH TIME ZONE,
    billing_frequency TEXT DEFAULT 'monthly' NOT NULL, -- 'monthly', 'yearly', 'trial'
    logo_url TEXT,
    gmail_message_id TEXT UNIQUE, -- prevent scanning same receipt twice
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for user subscriptions queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);

-- 3. SCANS TABLE
CREATE TABLE IF NOT EXISTS public.scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'completed' NOT NULL, -- 'running', 'completed', 'failed'
    scanned_count INTEGER DEFAULT 0 NOT NULL,
    found_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for user scans
CREATE INDEX IF NOT EXISTS idx_scans_user ON public.scans(user_id);

-- 4. INSIGHTS TABLE
CREATE TABLE IF NOT EXISTS public.insights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'roast', 'saving', 'summary'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for user insights
CREATE INDEX IF NOT EXISTS idx_insights_user ON public.insights(user_id);

-- Enable Row Level Security (RLS) on tables for secure client queries
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- Create Policies to ensure users only access their own data
CREATE POLICY "Allow individual users to manage their own user record"
    ON public.users
    FOR ALL
    USING (auth.uid()::text = id OR id = 'demo-user');

CREATE POLICY "Allow individual users to manage their own subscriptions"
    ON public.subscriptions
    FOR ALL
    USING (user_id = auth.uid()::text OR user_id = 'demo-user');

CREATE POLICY "Allow individual users to manage their own scans"
    ON public.scans
    FOR ALL
    USING (user_id = auth.uid()::text OR user_id = 'demo-user');

CREATE POLICY "Allow individual users to manage their own insights"
    ON public.insights
    FOR ALL
    USING (user_id = auth.uid()::text OR user_id = 'demo-user');
