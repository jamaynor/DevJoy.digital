-- Migration: 04_create_contact_submissions.sql
-- Description: Creates the contact_submissions table with owning_org attribute

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    owning_org TEXT NOT NULL DEFAULT 'default'
);

-- Create indexes
CREATE INDEX contact_submissions_email_idx ON public.contact_submissions (email);
CREATE INDEX contact_submissions_status_idx ON public.contact_submissions (status);
CREATE INDEX contact_submissions_owning_org_idx ON public.contact_submissions (owning_org);

-- Set up RLS (Row Level Security)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy for users to view submissions based on org hierarchy
CREATE POLICY "Users can view submissions in their org hierarchy"
    ON public.contact_submissions
    FOR SELECT
    USING (
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Policy for anonymous users to insert submissions
CREATE POLICY "Anonymous users can submit contact forms"
    ON public.contact_submissions
    FOR INSERT
    WITH CHECK (true);

-- Policy for users to update submissions in their org
CREATE POLICY "Users can update submissions in their org"
    ON public.contact_submissions
    FOR UPDATE
    USING (
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Policy for users to delete submissions in their org
CREATE POLICY "Users can delete submissions in their org"
    ON public.contact_submissions
    FOR DELETE
    USING (
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Trigger to ensure owning_org is stored in lowercase
CREATE TRIGGER ensure_lowercase_owning_org_contact_submissions
BEFORE INSERT OR UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION ensure_lowercase_owning_org();

-- Comment on table and columns
COMMENT ON TABLE public.contact_submissions IS 'Contact form submissions with organization-based access control';
COMMENT ON COLUMN public.contact_submissions.owning_org IS 'Organization hierarchy path for access control (stored in lowercase)';
