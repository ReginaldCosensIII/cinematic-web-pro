-- Add security logging functions and triggers

-- Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type TEXT,
  p_user_id UUID DEFAULT NULL,
  p_target_user_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    event_type,
    user_id,
    target_user_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    p_event_type,
    p_user_id,
    p_target_user_id,
    p_details,
    p_ip_address,
    p_user_agent
  );
END;
$$;

-- Create trigger function to audit role changes
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_security_event(
      'role_assigned',
      auth.uid(),
      NEW.user_id,
      jsonb_build_object(
        'role', NEW.role,
        'operation', 'INSERT'
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_security_event(
      'role_updated',
      auth.uid(),
      NEW.user_id,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'operation', 'UPDATE'
      )
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_security_event(
      'role_removed',
      auth.uid(),
      OLD.user_id,
      jsonb_build_object(
        'role', OLD.role,
        'operation', 'DELETE'
      )
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS audit_role_changes_trigger ON public.user_roles;
CREATE TRIGGER audit_role_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_role_changes();