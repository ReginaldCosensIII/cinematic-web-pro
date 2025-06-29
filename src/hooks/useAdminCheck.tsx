// src/hooks/useAdminCheck.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      setIsAdmin(null); // Reset on user change

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('has_role', { _user_id: user.id, _role: 'admin' });


        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data);
        }
      } catch (error) {
        console.error('Exception in admin check:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        checkAdminStatus();
    } else {
        setIsAdmin(false);
        setLoading(false);
    }
  }, [user]);

  return { isAdmin, loading };
};