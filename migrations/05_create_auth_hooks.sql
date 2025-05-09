-- Migration: 05_create_auth_hooks.sql
-- Description: Creates triggers and functions for auth events

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    home_org TEXT;
BEGIN
    -- Extract home_org from user metadata or set default
    home_org := COALESCE(
        NEW.raw_user_meta_data->>'home_org',
        'default'
    );
    
    -- Ensure home_org is lowercase
    home_org := LOWER(home_org);
    
    -- Create a new profile for the user
    INSERT INTO public.user_profiles (
        id,
        email,
        first_name,
        last_name,
        phone_number,
        home_org,
        avatar_url
    ) VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'phone_number',
        home_org,
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signups
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Function to update user profile on auth user update
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user profile when auth user is updated
    UPDATE public.user_profiles
    SET 
        email = NEW.email,
        updated_at = now()
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for user updates
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (OLD.email IS DISTINCT FROM NEW.email)
EXECUTE FUNCTION public.handle_user_update();

-- Comment on functions
COMMENT ON FUNCTION public.handle_new_user IS 'Creates a user profile when a new user signs up';
COMMENT ON FUNCTION public.handle_user_update IS 'Updates user profile when auth user is updated';
