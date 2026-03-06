-- Remove the overly permissive INSERT policy that allows anonymous log injection
-- The SECURITY DEFINER function log_security_event() bypasses RLS automatically
DROP POLICY IF EXISTS "System can insert audit logs" ON public.security_audit_log;