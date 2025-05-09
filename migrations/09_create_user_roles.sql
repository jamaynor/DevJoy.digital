-- Migration: 09_create_user_roles.sql
-- Description: Creates role-based access control

-- Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}',
    owning_org TEXT NOT NULL DEFAULT 'default',
    CONSTRAINT roles_name_owning_org_key UNIQUE (name, owning_org)
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id)
);

-- Create indexes
CREATE INDEX roles_owning_org_idx ON public.roles (owning_org);
CREATE INDEX user_roles_user_id_idx ON public.user_roles (user_id);
CREATE INDEX user_roles_role_id_idx ON public.user_roles (role_id);

-- Set up RLS (Row Level Security)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view roles based on org hierarchy
CREATE POLICY "Users can view roles in their org hierarchy"
    ON public.roles
    FOR SELECT
    USING (
        public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            owning_org
        )
    );

-- Policy for admins to manage roles
CREATE POLICY "Admins can manage roles"
    ON public.roles
    USING (
        (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()) = 'global_admin'
    );

-- Policy for users to view their own roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles
    FOR SELECT
    USING (
        user_id = auth.uid()
    );

-- Policy for admins to view all user roles
CREATE POLICY "Admins can view all user roles"
    ON public.user_roles
    FOR SELECT
    USING (
        (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()) = 'global_admin'
    );

-- Policy for admins to manage user roles
CREATE POLICY "Admins can manage user roles"
    ON public.user_roles
    USING (
        (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()) = 'global_admin'
    );

-- Trigger to ensure owning_org is stored in lowercase
CREATE TRIGGER ensure_lowercase_owning_org_roles
BEFORE INSERT OR UPDATE ON public.roles
FOR EACH ROW
EXECUTE FUNCTION ensure_lowercase_owning_org();

-- Function to check if a user has a specific role
CREATE OR REPLACE FUNCTION auth.has_role(role_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_id uuid;
    has_role boolean;
BEGIN
    -- Get the user ID from the JWT
    user_id := auth.uid();
    
    -- If no user is authenticated, return false
    IF user_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check if user has the role
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_id
        AND r.name = role_name
    ) INTO has_role;
    
    RETURN has_role;
END;
$$;

-- Function to get all roles for a user
CREATE OR REPLACE FUNCTION auth.get_user_roles()
RETURNS TABLE (
    role_id uuid,
    role_name text,
    permissions jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_id uuid;
BEGIN
    -- Get the user ID from the JWT
    user_id := auth.uid();
    
    -- If no user is authenticated, return empty result
    IF user_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Return all roles for the user
    RETURN QUERY
    SELECT 
        r.id as role_id,
        r.name as role_name,
        r.permissions
    FROM 
        public.user_roles ur
    JOIN 
        public.roles r ON ur.role_id = r.id
    WHERE 
        ur.user_id = user_id;
END;
$$;

-- Insert default roles
INSERT INTO public.roles (name, description, permissions, owning_org)
VALUES
    ('admin', 'Administrator with full access', '{"admin": true, "read": true, "write": true, "delete": true}', 'default'),
    ('editor', 'Editor with content management access', '{"read": true, "write": true, "delete": false}', 'default'),
    ('viewer', 'Viewer with read-only access', '{"read": true, "write": false, "delete": false}', 'default')
ON CONFLICT (name, owning_org) DO NOTHING;

-- Comment on tables and functions
COMMENT ON TABLE public.roles IS 'User roles for role-based access control';
COMMENT ON TABLE public.user_roles IS 'Junction table linking users to roles';
COMMENT ON FUNCTION auth.has_role IS 'Checks if a user has a specific role';
COMMENT ON FUNCTION auth.get_user_roles IS 'Gets all roles for the current user';
