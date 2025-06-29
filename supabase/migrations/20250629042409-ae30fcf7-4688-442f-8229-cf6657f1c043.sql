
-- Create a function to get admin projects data with aggregated statistics
CREATE OR REPLACE FUNCTION public.get_admin_projects_data()
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  user_id UUID,
  profiles JSONB,
  total_hours NUMERIC,
  invoice_total NUMERIC,
  assigned_users BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
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
