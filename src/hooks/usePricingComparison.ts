import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PricingComparisonRow {
  id: string;
  display_order: number;
  feature: string;
  description: string | null;
  free_is_boolean: boolean;
  free_value: string | null;
  pro_is_boolean: boolean;
  pro_value: string | null;
  enterprise_is_boolean: boolean;
  enterprise_value: string | null;
  is_active: boolean;
}

const KEY = 'pricing-comparison';

export function usePricingComparison() {
  const queryClient = useQueryClient();

  const { data: rows = [], isLoading, error } = useQuery({
    queryKey: [KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_comparison')
        .select('*')
        .order('display_order');
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const upsertMutation = useMutation({
    mutationFn: async (row: Partial<PricingComparisonRow> & { id?: string }) => {
      if (row.id) {
        const { data, error } = await supabase
          .from('pricing_comparison')
          .update(row)
          .eq('id', row.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
      const { data, error } = await supabase
        .from('pricing_comparison')
        .insert([row])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  });

  return {
    rows,
    loading: isLoading,
    error,
    upsert: (row: Partial<PricingComparisonRow> & { id?: string }) => upsertMutation.mutateAsync(row),
    refresh: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
  };
}


