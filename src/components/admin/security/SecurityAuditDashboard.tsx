import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, Eye, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

interface SecurityLog {
  id: string;
  event_type: string;
  user_id?: string;
  target_user_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

const SecurityAuditDashboard = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchSecurityLogs();
  }, [filter]);

  const fetchSecurityLogs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filter !== 'all') {
        query = query.eq('event_type', filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching security logs:', error);
        toast.error('Failed to fetch security logs');
        return;
      }

      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching security logs:', error);
      toast.error('Failed to fetch security logs');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (eventType: string) => {
    switch (eventType) {
      case 'failed_auth':
      case 'role_assigned':
      case 'role_updated':
      case 'role_removed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'password_changed':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'login':
      case 'logout':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const formatEventType = (eventType: string) => {
    return eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-webdev-gradient-blue"></div>
      </div>
    );
  }

  return (
    <Card className="w-full glass-effect border-webdev-glass-border bg-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-webdev-silver">
          <Shield className="w-5 h-5" />
          Security Audit Dashboard
        </CardTitle>
        <CardDescription className="text-webdev-soft-gray">
          Monitor security events and user activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="glass-effect"
          >
            All Events
          </Button>
          <Button
            variant={filter === 'failed_auth' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('failed_auth')}
            className="glass-effect"
          >
            Failed Auth
          </Button>
          <Button
            variant={filter === 'role_assigned' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('role_assigned')}
            className="glass-effect"
          >
            Role Changes
          </Button>
          <Button
            variant={filter === 'password_changed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('password_changed')}
            className="glass-effect"
          >
            Password Changes
          </Button>
        </div>

        {logs.length === 0 ? (
          <Alert className="glass-effect border-webdev-glass-border bg-webdev-darker-gray/30">
            <Eye className="h-4 w-4 text-webdev-gradient-blue" />
            <AlertDescription className="text-webdev-soft-gray">
              No security events found for the selected filter.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id} className="glass-effect border-webdev-glass-border bg-webdev-darker-gray/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getSeverityColor(log.event_type)} font-medium`}>
                          {formatEventType(log.event_type)}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-webdev-soft-gray">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(log.created_at)}
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        {log.user_id && (
                          <div className="flex items-center gap-1 text-webdev-soft-gray">
                            <User className="w-3 h-3" />
                            User ID: {log.user_id}
                          </div>
                        )}
                        
                        {log.target_user_id && (
                          <div className="flex items-center gap-1 text-webdev-soft-gray">
                            <User className="w-3 h-3" />
                            Target User ID: {log.target_user_id}
                          </div>
                        )}
                        
                        {log.ip_address && log.ip_address !== 'unknown' && (
                          <div className="text-webdev-soft-gray">
                            IP: {log.ip_address}
                          </div>
                        )}
                        
                        {log.details && (
                          <div className="text-webdev-soft-gray mt-2">
                            <details className="cursor-pointer">
                              <summary className="hover:text-webdev-silver">Event Details</summary>
                              <pre className="mt-1 text-xs bg-webdev-darker-gray/50 p-2 rounded border border-webdev-glass-border overflow-x-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {(log.event_type === 'failed_auth' || log.event_type.includes('role')) && (
                      <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-1" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAuditDashboard;