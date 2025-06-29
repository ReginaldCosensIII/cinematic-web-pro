
-- Create a security log table for tracking admin actions
CREATE TABLE public.admin_security_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a project assignments table to track user-project relationships
CREATE TABLE public.project_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(project_id, user_id)
);

-- Create a time tracking table for logging hours
CREATE TABLE public.time_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  milestone_id UUID REFERENCES public.milestones(id) ON DELETE SET NULL,
  hours DECIMAL(10,2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;

-- Admin security logs policies
CREATE POLICY "Admins can view all security logs" 
  ON public.admin_security_logs 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert security logs" 
  ON public.admin_security_logs 
  FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Project assignments policies
CREATE POLICY "Users can view their own assignments" 
  ON public.project_assignments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all assignments" 
  ON public.project_assignments 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all assignments" 
  ON public.project_assignments 
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Time entries policies
CREATE POLICY "Users can view their own time entries" 
  ON public.time_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own time entries" 
  ON public.time_entries 
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all time entries" 
  ON public.time_entries 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all time entries" 
  ON public.time_entries 
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create a function to get user stats for admin dashboard
CREATE OR REPLACE FUNCTION public.get_user_stats(target_user_id UUID)
RETURNS JSON
LANGUAGE SQL
SECURITY DEFINER
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
