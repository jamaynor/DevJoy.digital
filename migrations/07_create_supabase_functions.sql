-- Migration: 07_create_supabase_functions.sql
-- Description: Creates Supabase Edge Functions for advanced functionality

-- Function to get user profile with JWT claims
CREATE OR REPLACE FUNCTION public.get_user_profile_with_claims()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_id uuid;
    user_profile jsonb;
BEGIN
    -- Get the user ID from the JWT
    user_id := auth.uid();
    
    -- If no user is authenticated, return null
    IF user_id IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Get the user profile
    SELECT 
        jsonb_build_object(
            'id', up.id,
            'email', up.email,
            'first_name', up.first_name,
            'last_name', up.last_name,
            'phone_number', up.phone_number,
            'home_org', up.home_org,
            'avatar_url', up.avatar_url,
            'created_at', up.created_at,
            'updated_at', up.updated_at
        )
    INTO user_profile
    FROM public.user_profiles up
    WHERE up.id = user_id;
    
    RETURN user_profile;
END;
$$;

-- Function to check if a user has access to a specific organization
CREATE OR REPLACE FUNCTION public.has_org_access(target_org text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_id uuid;
    user_home_org text;
BEGIN
    -- Get the user ID from the JWT
    user_id := auth.uid();
    
    -- If no user is authenticated, return false
    IF user_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Get the user's home_org
    SELECT home_org INTO user_home_org
    FROM public.user_profiles
    WHERE id = user_id;
    
    -- If user not found, return false
    IF user_home_org IS NULL THEN
        RETURN false;
    END IF;
    
    -- Check if user has access using the match_org_hierarchy function
    RETURN public.match_org_hierarchy(user_home_org, target_org);
END;
$$;

-- Function to get all blog posts with pagination and filtering
CREATE OR REPLACE FUNCTION public.get_blog_posts(
    _limit integer DEFAULT 10,
    _offset integer DEFAULT 0,
    _category_slug text DEFAULT NULL,
    _search_term text DEFAULT NULL,
    _published_only boolean DEFAULT true
)
RETURNS TABLE (
    id uuid,
    created_at timestamptz,
    updated_at timestamptz,
    title text,
    slug text,
    excerpt text,
    published boolean,
    published_at timestamptz,
    featured_image text,
    author_id uuid,
    category_id uuid,
    views_count integer,
    owning_org text,
    author_name text,
    category_name text,
    category_slug text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bp.id,
        bp.created_at,
        bp.updated_at,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.published,
        bp.published_at,
        bp.featured_image,
        bp.author_id,
        bp.category_id,
        bp.views_count,
        bp.owning_org,
        (up.first_name || ' ' || up.last_name) as author_name,
        bc.name as category_name,
        bc.slug as category_slug
    FROM 
        blog_posts bp
    JOIN 
        user_profiles up ON bp.author_id = up.id
    JOIN 
        blog_categories bc ON bp.category_id = bc.id
    WHERE 
        (_published_only = false OR bp.published = true)
        AND (_category_slug IS NULL OR bc.slug = _category_slug)
        AND (_search_term IS NULL OR 
            bp.title ILIKE '%' || _search_term || '%' OR 
            bp.content ILIKE '%' || _search_term || '%' OR
            COALESCE(bp.excerpt, '') ILIKE '%' || _search_term || '%')
        AND public.match_org_hierarchy(
            (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()),
            bp.owning_org
        )
    ORDER BY 
        bp.published_at DESC NULLS LAST, 
        bp.created_at DESC
    LIMIT _limit
    OFFSET _offset;
END;
$$;

-- Comment on functions
COMMENT ON FUNCTION public.get_user_profile_with_claims IS 'Gets the user profile with JWT claims';
COMMENT ON FUNCTION public.has_org_access IS 'Checks if a user has access to a specific organization';
COMMENT ON FUNCTION public.get_blog_posts IS 'Gets blog posts with pagination and filtering';
