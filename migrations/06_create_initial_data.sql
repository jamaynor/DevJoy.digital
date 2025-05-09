-- Migration: 06_create_initial_data.sql
-- Description: Inserts initial data for the application

-- Insert default blog categories
INSERT INTO public.blog_categories (name, slug, description, owning_org)
VALUES
    ('Technology', 'technology', 'Articles about technology and innovation', 'default'),
    ('Business', 'business', 'Business strategies and insights', 'default'),
    ('AI', 'ai', 'Artificial Intelligence and Machine Learning', 'default'),
    ('Automation', 'automation', 'Process automation and efficiency', 'default'),
    ('Case Studies', 'case-studies', 'Real-world examples and success stories', 'default')
ON CONFLICT (slug) DO NOTHING;

-- Create a global admin user profile if it doesn't exist
-- Note: This assumes you've already created a user with this ID in auth.users
-- You would replace '00000000-0000-0000-0000-000000000000' with the actual UUID
DO $$
DECLARE
    admin_user_id UUID := '00000000-0000-0000-0000-000000000000'; -- Replace with actual admin UUID
    admin_exists BOOLEAN;
BEGIN
    -- Check if the admin user exists in auth.users
    SELECT EXISTS (
        SELECT 1 FROM auth.users WHERE id = admin_user_id
    ) INTO admin_exists;
    
    -- If admin exists in auth.users but not in user_profiles, create the profile
    IF admin_exists THEN
        INSERT INTO public.user_profiles (
            id, 
            email, 
            first_name, 
            last_name, 
            home_org
        )
        VALUES (
            admin_user_id,
            'admin@example.com', -- Replace with actual admin email
            'Admin',
            'User',
            'global_admin'
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;
END $$;

-- Comment on migration
COMMENT ON TABLE public.blog_categories IS 'Initial data setup for the application';
