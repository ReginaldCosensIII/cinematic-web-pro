
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('useAdminCheck - Starting admin check for user:', user?.id);
      
      // Always start with loading true
      setLoading(true);
      
      if (!user) {
        console.log('useAdminCheck - No user found');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('useAdminCheck - Querying user_roles table for user:', user.id);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        console.log('useAdminCheck - Query result:', { data, error });

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          const adminStatus = !!data;
          console.log('useAdminCheck - Admin status determined:', adminStatus);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        // CRITICAL: Only set loading to false after the query is completely done
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  console.log('useAdminCheck - Current state:', { isAdmin, loading, userId: user?.id });

  return { isAdmin, loading };
};
