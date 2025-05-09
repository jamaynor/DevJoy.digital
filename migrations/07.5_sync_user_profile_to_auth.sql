CREATE OR REPLACE FUNCTION public.sync_user_profile_to_auth()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Update the raw_user_meta_data in auth.users
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
$$;

CREATE TRIGGER update_auth_user_meta
AFTER INSERT OR UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_user_profile_to_auth();
