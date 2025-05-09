-- Migration: 10_create_settings.sql
-- Description: Creates application settings table

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false NOT NULL,
    owning_org TEXT NOT NULL DEFAULT 'default',
    CONSTRAINT settings_key_owning_org_key UNIQUE (key, owning_org)
);

-- Create indexes
CREATE INDEX settings_key_idx ON public.settings (key);
CREATE INDEX settings_owning_org_idx ON public.settings (owning_org);
CREATE INDEX settings_is_public_idx ON public.settings (is_public);

-- Create trigger to update the updated_at column
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Set up RLS (Row Level Security)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Policy for users to view public settings
CREATE POLICY "Anyone can view public settings"
    ON public.settings
    FOR SELECT
    USING (
        is_public = true
    );

-- Policy for users to view private settings in their org
CREATE POLICY "Users can view private settings in their org"
    ON public.settings
    FOR SELECT
    USING (
        is_public = false AND
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Policy for admins to manage settings
CREATE POLICY "Admins can manage settings"
    ON public.settings
    USING (
        (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()) = 'global_admin'
    );

-- Trigger to ensure owning_org is stored in lowercase
CREATE TRIGGER ensure_lowercase_owning_org_settings
BEFORE INSERT OR UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION ensure_lowercase_owning_org();

-- Function to get a setting by key
CREATE OR REPLACE FUNCTION public.get_setting(setting_key text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    setting_value jsonb;
    user_home_org text;
BEGIN
    -- Get the user's home_org
    SELECT home_org INTO user_home_org
    FROM public.user_profiles
    WHERE id = auth.uid();
    
    -- Get the setting value
    SELECT value INTO setting_value
    FROM public.settings
    WHERE key = setting_key
    AND (
        is_public = true
        OR (
            is_public = false
            AND public.match_org_hierarchy(user_home_org, owning_org)
        )
    )
    ORDER BY 
        -- Prefer exact org match, then hierarchical matches
        CASE WHEN owning_org = user_home_org THEN 0 ELSE 1 END,
        -- Prefer longer (more specific) org paths
        length(owning_org) DESC
    LIMIT 1;
    
    RETURN setting_value;
END;
$$;

-- Insert default settings
INSERT INTO public.settings (key, value, description, is_public, owning_org)
VALUES
    ('site_name', '"DevJoy Digital"', 'The name of the site', true, 'default'),
    ('site_description', '"Unlock Your Business Potential with AI-Driven Automation"', 'The site description', true, 'default'),
    ('contact_email', '"info@example.com"', 'Contact email address', true, 'default'),
    ('theme_colors', '{"primary": "#A40606", "secondary": "#1C77C3", "accent": "#C7D6CA", "background": "#F8F7F1", "dark": "#31081F"}', 'Theme colors', true, 'default'),
    ('features_enabled', '{"blogs": true, "contact_form": true, "user_registration": true}', 'Enabled features', false, 'default')
ON CONFLICT (key, owning_org) DO NOTHING;

-- Comment on table and functions
COMMENT ON TABLE public.settings IS 'Application settings with organization-based access control';
COMMENT ON FUNCTION public.get_setting IS 'Gets a setting by key with organization hierarchy support';
