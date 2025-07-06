import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, MessageCircle, FileText, UserCheck, Shield } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'blog' | 'contact' | 'user' | 'security';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

const AdminRecentActivity = () => {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      // Fetch recent blog articles
      const { data: blogData } = await supabase
        .from('blog_articles')
        .select('id, title, created_at, is_published')
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch recent contact submissions
      const { data: contactData } = await supabase
        .from('contact_submissions')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      // Fetch recent security logs
      const { data: securityData } = await supabase
        .from('admin_security_logs')
        .select('id, action_type, created_at, details')
        .order('created_at', { ascending: false })
        .limit(2);

      const activities: ActivityItem[] = [];

      // Add blog activities
      if (blogData) {
        blogData.forEach(article => {
          activities.push({
            id: `blog-${article.id}`,
            type: 'blog',
            title: `New blog article: ${article.title}`,
            description: article.is_published ? 'Published' : 'Draft',
            timestamp: article.created_at,
            status: article.is_published ? 'published' : 'draft'
          });
        });
      }

      // Add contact activities
      if (contactData) {
        contactData.forEach(contact => {
          activities.push({
            id: `contact-${contact.id}`,
            type: 'contact',
            title: `New contact submission from ${contact.name}`,
            description: contact.email,
            timestamp: contact.created_at
          });
        });
      }

      // Add security activities
      if (securityData) {
        securityData.forEach(log => {
          activities.push({
            id: `security-${log.id}`,
            type: 'security',
            title: `Security event: ${log.action_type}`,
            description: 'Admin activity logged',
            timestamp: log.created_at
          });
        });
      }

      // Sort by timestamp
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 8);
    }
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'blog': return <FileText className="w-4 h-4" />;
      case 'contact': return <MessageCircle className="w-4 h-4" />;
      case 'user': return <UserCheck className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'blog': return 'text-blue-400';
      case 'contact': return 'text-green-400';
      case 'user': return 'text-purple-400';
      case 'security': return 'text-red-400';
      default: return 'text-webdev-soft-gray';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const colors = {
      published: 'bg-green-500/20 text-green-400 border-green-500/30',
      draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };

    return (
      <Badge className={`text-xs ${colors[status as keyof typeof colors] || 'bg-webdev-soft-gray/20 text-webdev-soft-gray'}`}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="glass-effect border-webdev-glass-border">
        <CardHeader>
          <CardTitle className="text-webdev-silver">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-webdev-soft-gray">Loading activities...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-webdev-glass-border">
      <CardHeader>
        <CardTitle className="text-webdev-silver flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-webdev-darker-gray/30 border border-webdev-glass-border"
            >
              <div className={`mt-1 ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-webdev-silver text-sm font-medium line-clamp-1">
                    {activity.title}
                  </h4>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-webdev-soft-gray text-xs mb-1 line-clamp-1">
                  {activity.description}
                </p>
                <p className="text-webdev-soft-gray text-xs opacity-75">
                  {formatDistance(new Date(activity.timestamp), new Date(), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8 text-webdev-soft-gray">
              No recent activity
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRecentActivity;