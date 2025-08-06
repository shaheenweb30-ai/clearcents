import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PricingContent {
  id: string;
  section_id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_color: string | null;
  button_text_color: string | null;
  title_color: string | null;
  subtitle_color: string | null;
  description_color: string | null;
  background_color: string | null;
  image_url: string | null;
}

const PRICING_CONTENT_KEY = 'pricing-content';

export function useOptimizedPricingContent() {
  const queryClient = useQueryClient();

  // Fetch all pricing content
  const { data: content = [], isLoading, error } = useQuery({
    queryKey: [PRICING_CONTENT_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_content')
        .select('*')
        .order('section_id');

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Optimistic update mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ sectionId, updates }: { sectionId: string; updates: Partial<PricingContent> }) => {
      // Check if section exists
      const { data: existingData, error: checkError } = await supabase
        .from('pricing_content')
        .select('id')
        .eq('section_id', sectionId)
        .maybeSingle();

      if (checkError) throw checkError;

      let result;
      if (existingData) {
        // Update existing
        const { data, error } = await supabase
          .from('pricing_content')
          .update(updates)
          .eq('section_id', sectionId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('pricing_content')
          .insert([{ section_id: sectionId, ...updates }])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return result;
    },
    onMutate: async ({ sectionId, updates }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [PRICING_CONTENT_KEY] });

      // Snapshot the previous value
      const previousContent = queryClient.getQueryData([PRICING_CONTENT_KEY]);

      // Optimistically update to the new value
      queryClient.setQueryData([PRICING_CONTENT_KEY], (old: PricingContent[] = []) => {
        const existingIndex = old.findIndex(item => item.section_id === sectionId);
        if (existingIndex >= 0) {
          return old.map(item => 
            item.section_id === sectionId ? { ...item, ...updates } : item
          );
        } else {
          return [...old, { section_id: sectionId, ...updates } as PricingContent];
        }
      });

      // Return a context object with the snapshotted value
      return { previousContent };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousContent) {
        queryClient.setQueryData([PRICING_CONTENT_KEY], context.previousContent);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [PRICING_CONTENT_KEY] });
    },
  });

  const getContentBySection = (sectionId: string) => {
    return content.find(item => item.section_id === sectionId);
  };

  const updateContent = async (sectionId: string, updates: Partial<PricingContent>) => {
    return updateContentMutation.mutateAsync({ sectionId, updates });
  };

  return {
    content,
    loading: isLoading,
    error,
    updateContent,
    getContentBySection,
    refetch: () => queryClient.invalidateQueries({ queryKey: [PRICING_CONTENT_KEY] }),
    isUpdating: updateContentMutation.isPending,
  };
} 