-- Migration: 02_create_blog_categories.sql
-- Description: Creates the blog_categories table with owning_org attribute

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    owning_org TEXT NOT NULL DEFAULT 'default',
    CONSTRAINT blog_categories_slug_key UNIQUE (slug)
);

-- Create index on owning_org for faster filtering
CREATE INDEX blog_categories_owning_org_idx ON public.blog_categories (owning_org);

-- Set up RLS (Row Level Security)
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Function to check if user's home_org matches the beginning of owning_org or is global_admin
CREATE OR REPLACE FUNCTION public.match_org_hierarchy(user_home_org TEXT, data_owning_org TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Convert to lowercase for case-insensitive comparison
    user_home_org := LOWER(user_home_org);
    data_owning_org := LOWER(data_owning_org);
    
    -- Global admin has access to everything
    IF user_home_org = 'global_admin' THEN
        RETURN TRUE;
    END IF;
    
    -- Check if user's home_org is a prefix of the data's owning_org
    RETURN data_owning_org LIKE (user_home_org || '%');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Policy for users to view categories based on org hierarchy
CREATE POLICY "Users can view categories in their org hierarchy"
    ON public.blog_categories
    FOR SELECT
    USING (
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Policy for users to insert categories in their org
CREATE POLICY "Users can insert categories in their org"
    ON public.blog_categories
    FOR INSERT
    WITH CHECK (
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Policy for users to update categories in their org
CREATE POLICY "Users can update categories in their org"
    ON public.blog_categories
    FOR UPDATE
    USING (
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Policy for users to delete categories in their org
CREATE POLICY "Users can delete categories in their org"
    ON public.blog_categories
    FOR DELETE
    USING (
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Trigger to ensure owning_org is stored in lowercase
CREATE OR REPLACE FUNCTION ensure_lowercase_owning_org()
RETURNS TRIGGER AS $$
BEGIN
    NEW.owning_org = LOWER(NEW.owning_org);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_lowercase_owning_org_blog_categories
BEFORE INSERT OR UPDATE ON public.blog_categories
FOR EACH ROW
EXECUTE FUNCTION ensure_lowercase_owning_org();

-- Comment on table and columns
COMMENT ON TABLE public.blog_categories IS 'Blog categories with organization-based access control';
COMMENT ON COLUMN public.blog_categories.owning_org IS 'Organization hierarchy path for access control (stored in lowercase)';
