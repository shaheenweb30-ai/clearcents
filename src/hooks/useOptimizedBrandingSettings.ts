import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BrandingSettings {
  id: string;
  business_name: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  created_at: string;
  updated_at: string;
}

const BRANDING_SETTINGS_KEY = 'branding-settings';

export function useOptimizedBrandingSettings() {
  const queryClient = useQueryClient();

  // Fetch branding settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: [BRANDING_SETTINGS_KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branding_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (updates: Partial<BrandingSettings>) => {
      if (!settings) throw new Error('No settings to update');

      const { data, error } = await supabase
        .from('branding_settings')
        .update(updates)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (updates) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [BRANDING_SETTINGS_KEY] });

      // Snapshot the previous value
      const previousSettings = queryClient.getQueryData([BRANDING_SETTINGS_KEY]);

      // Optimistically update to the new value
      queryClient.setQueryData([BRANDING_SETTINGS_KEY], (old: BrandingSettings | null) => {
        if (!old) return old;
        return { ...old, ...updates };
      });

      // Return a context object with the snapshotted value
      return { previousSettings };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSettings) {
        queryClient.setQueryData([BRANDING_SETTINGS_KEY], context.previousSettings);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [BRANDING_SETTINGS_KEY] });
    },
  });

  // Upload logo mutation
  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(fileName);

      // Update settings with new logo URL
      if (settings) {
        await updateSettingsMutation.mutateAsync({ logo_url: publicUrl });
      }
      
      return publicUrl;
    },
    onSuccess: () => {
      // Invalidate branding settings to refetch with new logo
      queryClient.invalidateQueries({ queryKey: [BRANDING_SETTINGS_KEY] });
    },
  });

  const updateSettings = async (updates: Partial<BrandingSettings>) => {
    return updateSettingsMutation.mutateAsync(updates);
  };

  const uploadLogo = async (file: File) => {
    return uploadLogoMutation.mutateAsync(file);
  };

  return {
    settings,
    loading: isLoading,
    error,
    updateSettings,
    uploadLogo,
    refetch: () => queryClient.invalidateQueries({ queryKey: [BRANDING_SETTINGS_KEY] }),
    isUpdating: updateSettingsMutation.isPending,
    isUploading: uploadLogoMutation.isPending,
  };
} 