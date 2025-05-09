-- Migration: 08_create_audit_logs.sql
-- Description: Creates audit logging for tracking changes

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT
);

-- Create indexes
CREATE INDEX audit_logs_user_id_idx ON public.audit_logs (user_id);
CREATE INDEX audit_logs_table_name_idx ON public.audit_logs (table_name);
CREATE INDEX audit_logs_action_idx ON public.audit_logs (action);
CREATE INDEX audit_logs_created_at_idx ON public.audit_logs (created_at);

-- Set up RLS (Row Level Security)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view audit logs
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs
    FOR SELECT
    USING (
        (SELECT home_org FROM public.user_profiles WHERE id = auth.uid()) = 'global_admin'
    );

-- Function to log changes
CREATE OR REPLACE FUNCTION public.log_audit_event()
RETURNS TRIGGER AS $$
DECLARE
    _old_data JSONB := NULL;
    _new_data JSONB := NULL;
    _user_id UUID := auth.uid();
    _ip_address TEXT := NULL;
    _user_agent TEXT := NULL;
BEGIN
    -- Get request information if available
    BEGIN
        _ip_address := current_setting('request.headers')::jsonb->>'x-forwarded-for';
    EXCEPTION WHEN OTHERS THEN
        _ip_address := NULL;
    END;
    
    BEGIN
        _user_agent := current_setting('request.headers')::jsonb->>'user-agent';
    EXCEPTION WHEN OTHERS THEN
        _user_agent := NULL;
    END;
    
    -- Determine action and data
    IF (TG_OP = 'INSERT') THEN
        _new_data := to_jsonb(NEW);
        
        INSERT INTO public.audit_logs (
            user_id,
            action,
            table_name,
            record_id,
            old_data,
            new_data,
            ip_address,
            user_agent
        ) VALUES (
            _user_id,
            'INSERT',
            TG_TABLE_NAME,
            NEW.id,
            NULL,
            _new_data,
            _ip_address,
            _user_agent
        );
        
    ELSIF (TG_OP = 'UPDATE') THEN
        _old_data := to_jsonb(OLD);
        _new_data := to_jsonb(NEW);
        
        -- Only log if there are actual changes
        IF _old_data <> _new_data THEN
            INSERT INTO public.audit_logs (
                user_id,
                action,
                table_name,
                record_id,
                old_data,
                new_data,
                ip_address,
                user_agent
            ) VALUES (
                _user_id,
                'UPDATE',
                TG_TABLE_NAME,
                NEW.id,
                _old_data,
                _new_data,
                _ip_address,
                _user_agent
            );
        END IF;
        
    ELSIF (TG_OP = 'DELETE') THEN
        _old_data := to_jsonb(OLD);
        
        INSERT INTO public.audit_logs (
            user_id,
            action,
            table_name,
            record_id,
            old_data,
            new_data,
            ip_address,
            user_agent
        ) VALUES (
            _user_id,
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            _old_data,
            NULL,
            _ip_address,
            _user_agent
        );
    END IF;
    
    -- Return appropriate record based on operation
    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to tables
CREATE TRIGGER audit_user_profiles
AFTER INSERT OR UPDATE OR DELETE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_blog_categories
AFTER INSERT OR UPDATE OR DELETE ON public.blog_categories
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_blog_posts
AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

CREATE TRIGGER audit_contact_submissions
AFTER INSERT OR UPDATE OR DELETE ON public.contact_submissions
FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();

-- Comment on table and functions
COMMENT ON TABLE public.audit_logs IS 'Audit logs for tracking changes to data';
COMMENT ON FUNCTION public.log_audit_event IS 'Function to log audit events for data changes';
