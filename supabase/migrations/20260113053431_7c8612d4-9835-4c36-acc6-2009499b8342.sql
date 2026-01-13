-- Fix SECURITY DEFINER functions by adding SET search_path = public, pg_temp

-- Fix get_user_stats function
CREATE OR REPLACE FUNCTION public.get_user_stats(target_user_id uuid)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT json_build_object(
    'total_projects', COALESCE((
      SELECT COUNT(*) 
      FROM public.project_assignments 
      WHERE user_id = target_user_id
    ), 0),
    'total_hours', COALESCE((
      SELECT SUM(hours) 
      FROM public.time_entries 
      WHERE user_id = target_user_id
    ), 0),
    'outstanding_invoices', COALESCE((
      SELECT COUNT(*) 
      FROM public.invoices 
      WHERE user_id = target_user_id 
      AND status IN ('draft', 'sent', 'overdue')
    ), 0),
    'total_invoice_amount', COALESCE((
      SELECT SUM(amount) 
      FROM public.invoices 
      WHERE user_id = target_user_id 
      AND status IN ('draft', 'sent', 'overdue')
    ), 0)
  );
$$;

-- Fix get_admin_projects_data function
CREATE OR REPLACE FUNCTION public.get_admin_projects_data()
RETURNS TABLE(id uuid, title text, description text, status text, created_at timestamp with time zone, user_id uuid, profiles jsonb, total_hours numeric, invoice_total numeric, assigned_users bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT 
    p.id,
    p.title,
    p.description,
    p.status,
    p.created_at,
    p.user_id,
    jsonb_build_object(
      'full_name', pr.full_name,
      'username', pr.username
    ) as profiles,
    COALESCE(SUM(te.hours), 0) as total_hours,
    COALESCE(SUM(i.amount), 0) as invoice_total,
    COALESCE(COUNT(DISTINCT pa.user_id), 0) as assigned_users
  FROM public.projects p
  LEFT JOIN public.profiles pr ON p.user_id = pr.id
  LEFT JOIN public.time_entries te ON p.id = te.project_id
  LEFT JOIN public.invoices i ON p.id = i.project_id AND i.status IN ('draft', 'sent', 'overdue')
  LEFT JOIN public.project_assignments pa ON p.id = pa.project_id
  GROUP BY p.id, p.title, p.description, p.status, p.created_at, p.user_id, pr.full_name, pr.username
  ORDER BY p.created_at DESC;
$$;

-- Fix log_security_event function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text, 
  p_user_id uuid DEFAULT NULL::uuid, 
  p_target_user_id uuid DEFAULT NULL::uuid, 
  p_details jsonb DEFAULT NULL::jsonb, 
  p_ip_address text DEFAULT NULL::text, 
  p_user_agent text DEFAULT NULL::text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

-- Fix audit_role_changes function
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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