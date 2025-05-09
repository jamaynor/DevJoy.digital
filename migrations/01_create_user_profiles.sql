-- Migration: 01_create_user_profiles.sql
-- Description: Creates the user_profiles table with home_org attribute

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT NOT NULL,
    phone_number TEXT,
    home_org TEXT NOT NULL DEFAULT 'default',
    avatar_url TEXT,
    CONSTRAINT user_profiles_email_key UNIQUE (email)
);

-- Create trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Set up RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own profile
CREATE POLICY "Users can view own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy for service role to manage all profiles
CREATE POLICY "Service role can manage all profiles"
    ON public.user_profiles
    USING (auth.role() = 'service_role');

-- Add function to sync user data to auth.users metadata
CREATE OR REPLACE FUNCTION sync_user_data_to_auth()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user metadata in auth.users
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_build_object(
        'first_name', NEW.first_name,
        'last_name', NEW.last_name,
        'phone_number', NEW.phone_number,
        'home_org', LOWER(NEW.home_org),
        'avatar_url', NEW.avatar_url
    )
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync user data to auth.users
CREATE TRIGGER sync_user_data_to_auth
AFTER INSERT OR UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION sync_user_data_to_auth();

-- Comment on table and columns
COMMENT ON TABLE public.user_profiles IS 'User profile information with home_org for organization-based access control';
COMMENT ON COLUMN public.user_profiles.home_org IS 'Organization hierarchy path for access control (stored in lowercase)';
