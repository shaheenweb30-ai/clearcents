import { useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserTrial {
  id: string;
  user_id: string;
  started_at: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
}

export function useTrial(user: User | null) {
  const [trial, setTrial] = useState<UserTrial | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [starting, setStarting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrial = useCallback(async () => {
    if (!user) {
      setTrial(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('user_trials')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && (error as any).code !== 'PGRST116') {
        // PGRST116: No rows found
        throw error;
      }

      setTrial((data as unknown as UserTrial) || null);
    } catch (e: any) {
      console.error('useTrial: fetchTrial error', e);
      setError('Failed to load trial status');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTrial();
  }, [fetchTrial]);

  const isTrialActive = useMemo(() => {
    if (!trial) return false;
    const now = new Date();
    const ends = new Date(trial.ends_at);
    return now < ends;
  }, [trial]);

  const startTrial = useCallback(async () => {
    if (!user) throw new Error('Not authenticated');
    setStarting(true);
    setError(null);
    try {
      // Check if a trial exists already
      const { data: existing } = await supabase
        .from('user_trials')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (existing) {
        setTrial(existing as unknown as UserTrial);
        return { ok: true, alreadyExists: true, trial: existing as unknown as UserTrial } as const;
      }

      // Create a new 1-day trial
      const { data, error } = await supabase
        .from('user_trials')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      setTrial(data as unknown as UserTrial);
      return { ok: true, alreadyExists: false, trial: data as unknown as UserTrial } as const;
    } catch (e: any) {
      console.error('useTrial: startTrial error', e);
      setError('Failed to start trial');
      return { ok: false, alreadyExists: false, trial: null } as const;
    } finally {
      setStarting(false);
    }
  }, [user]);

  return {
    trial,
    loading,
    starting,
    error,
    isTrialActive,
    startTrial,
    refresh: fetchTrial,
  } as const;
}


