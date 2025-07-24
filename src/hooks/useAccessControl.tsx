import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AccessRequest {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  expires_at?: string;
}

export const useAccessControl = () => {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessRequest, setAccessRequest] = useState<AccessRequest | null>(null);
  const { user } = useAuth();

  const checkAccess = async () => {
    if (!user?.email) {
      setHasAccess(false);
      setIsLoading(false);
      return;
    }

    try {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('user_id', user.id)
        .single();

      if (profile?.email === 'mkito@ap.equinix.com') {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // Check if user has approved access request
      const { data: requests, error } = await supabase
        .from('access_requests')
        .select('*')
        .eq('email', user.email)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      if (requests && requests.length > 0) {
        const request = requests[0] as AccessRequest;
        const now = new Date();
        const expiresAt = new Date(request.expires_at!);
        
        if (now <= expiresAt) {
          setHasAccess(true);
          setAccessRequest(request);
        } else {
          setHasAccess(false);
        }
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error in access control check:', error);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [user]);

  return {
    hasAccess,
    isLoading,
    accessRequest,
    checkAccess,
  };
};