-- Migration: 03_create_blog_posts.sql
-- Description: Creates the blog_posts table with owning_org attribute

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    published BOOLEAN DEFAULT false NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    featured_image TEXT,
    author_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.blog_categories(id) ON DELETE CASCADE,
    views_count INTEGER DEFAULT 0 NOT NULL,
    owning_org TEXT NOT NULL DEFAULT 'default',
    CONSTRAINT blog_posts_slug_key UNIQUE (slug)
);

-- Create indexes
CREATE INDEX blog_posts_author_id_idx ON public.blog_posts (author_id);
CREATE INDEX blog_posts_category_id_idx ON public.blog_posts (category_id);
CREATE INDEX blog_posts_owning_org_idx ON public.blog_posts (owning_org);
CREATE INDEX blog_posts_published_idx ON public.blog_posts (published);

-- Create trigger to update the updated_at column
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Set up RLS (Row Level Security)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for users to view published posts based on org hierarchy
CREATE POLICY "Users can view published posts in their org hierarchy"
    ON public.blog_posts
    FOR SELECT
    USING (
        published = true AND
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Policy for authors to view their own unpublished posts
CREATE POLICY "Authors can view their own unpublished posts"
    ON public.blog_posts
    FOR SELECT
    USING (
        published = false AND
        author_id = auth.uid()
    );

-- Policy for users to insert posts in their org
CREATE POLICY "Users can insert posts in their org"
    ON public.blog_posts
    FOR INSERT
    WITH CHECK (
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Policy for authors to update their own posts
CREATE POLICY "Authors can update their own posts"
    ON public.blog_posts
    FOR UPDATE
    USING (
        author_id = auth.uid() AND
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Policy for authors to delete their own posts
CREATE POLICY "Authors can delete their own posts"
    ON public.blog_posts
    FOR DELETE
    USING (
        author_id = auth.uid() AND
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Trigger to ensure owning_org is stored in lowercase
CREATE TRIGGER ensure_lowercase_owning_org_blog_posts
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION ensure_lowercase_owning_org();

-- Trigger to set published_at when post is published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.published = true AND (OLD IS NULL OR OLD.published = false) THEN
        NEW.published_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_published_at_blog_posts
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION set_published_at();

-- Comment on table and columns
COMMENT ON TABLE public.blog_posts IS 'Blog posts with organization-based access control';
COMMENT ON COLUMN public.blog_posts.owning_org IS 'Organization hierarchy path for access control (stored in lowercase)';
