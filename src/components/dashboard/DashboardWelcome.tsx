
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Calendar, Clock, TrendingUp } from 'lucide-react';

interface DashboardWelcomeProps {
  user: User;
}

const DashboardWelcome = ({ user }: DashboardWelcomeProps) => {
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  
  return (
    <div className="glass-effect rounded-2xl p-8 border border-webdev-glass-border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-light text-webdev-silver mb-2">
            Welcome back, <span className="bg-gradient-to-r from-webdev-gradient-blue to-webdev-gradient-purple bg-clip-text text-transparent font-semibold">{userName}</span>
          </h1>
          <p className="text-webdev-soft-gray text-lg">
            Here's what's happening with your projects
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border text-center">
            <Calendar className="w-6 h-6 text-webdev-gradient-blue mx-auto mb-2" />
            <div className="text-sm text-webdev-soft-gray">This Month</div>
            <div className="text-lg font-semibold text-webdev-silver">3 Projects</div>
          </div>
          
          <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border text-center">
            <Clock className="w-6 h-6 text-webdev-gradient-purple mx-auto mb-2" />
            <div className="text-sm text-webdev-soft-gray">Hours Logged</div>
            <div className="text-lg font-semibold text-webdev-silver">127.5h</div>
          </div>
          
          <div className="glass-effect rounded-xl p-4 border border-webdev-glass-border text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-sm text-webdev-soft-gray">Completion</div>
            <div className="text-lg font-semibold text-webdev-silver">78%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWelcome;
