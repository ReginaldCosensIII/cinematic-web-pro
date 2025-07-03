
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import Dashboard from "./pages/Dashboard";
import DashboardProjects from "./pages/DashboardProjects";
import DashboardInvoices from "./pages/DashboardInvoices";
import DashboardMilestones from "./pages/DashboardMilestones";
import DashboardSettings from "./pages/DashboardSettings";
import DashboardTimeTracking from "./pages/DashboardTimeTracking";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProjects from "./pages/AdminProjects";
import AdminHours from "./pages/AdminHours";
import AdminInvoices from "./pages/AdminInvoices";
import AdminSubmissions from "./pages/AdminSubmissions";
import AdminSettings from "./pages/AdminSettings";
import AdminMilestones from "./pages/AdminMilestones";
import AdminBlog from "./pages/AdminBlog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/projects" element={<DashboardProjects />} />
            <Route path="/dashboard/invoices" element={<DashboardInvoices />} />
            <Route path="/dashboard/milestones" element={<DashboardMilestones />} />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />
            <Route path="/dashboard/time-tracking" element={<DashboardTimeTracking />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/milestones" element={<AdminMilestones />} />
            <Route path="/admin/hours" element={<AdminHours />} />
            <Route path="/admin/invoices" element={<AdminInvoices />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/submissions" element={<AdminSubmissions />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
