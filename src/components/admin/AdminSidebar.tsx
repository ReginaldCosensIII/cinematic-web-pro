
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FolderOpen, 
  Clock, 
  Receipt, 
  FileText,
  Settings,
  LogOut,
  Target,
  PenTool
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: FolderOpen, label: 'Projects', path: '/admin/projects' },
    { icon: User, label: 'Clients', path: '/admin/users' },
    { icon: Target, label: 'Milestones', path: '/admin/milestones' },
    { icon: Clock, label: 'Hours Logged', path: '/admin/hours' },
    { icon: Receipt, label: 'Invoices', path: '/admin/invoices' },
    { icon: PenTool, label: 'Blog', path: '/admin/blog' },
    { icon: FileText, label: 'Form Submissions', path: '/admin/submissions' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="glass-effect rounded-2xl p-6 border border-webdev-glass-border h-fit sticky top-32">
      <div className="mb-8">
        <Link to="/" className="text-2xl font-light text-webdev-silver hover:text-white transition-colors">
          &lt;/WebDev<span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent">Pro</span>&gt;
        </Link>
        <p className="text-sm text-webdev-soft-gray mt-1">Admin Portal</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-webdev-gradient-blue/20 to-webdev-gradient-purple/20 text-webdev-silver border border-webdev-gradient-blue/30' 
                  : 'text-webdev-soft-gray hover:text-webdev-silver hover:bg-webdev-darker-gray/50'
              }`}
            >
              <IconComponent className={`w-5 h-5 transition-colors ${
                isActive ? 'text-webdev-gradient-blue' : 'group-hover:text-webdev-gradient-blue'
              }`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-8 pt-6 border-t border-webdev-glass-border">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-webdev-soft-gray hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 w-full group"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
