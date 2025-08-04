import { useState, useEffect } from 'react';
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

export function useBrandingSettings() {
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('branding_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching branding settings:', error);
      } else {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching branding settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (updates: Partial<BrandingSettings>) => {
    try {
      if (!settings) return;

      const { data, error } = await supabase
        .from('branding_settings')
        .update(updates)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSettings(data);
      return data;
    } catch (error) {
      console.error('Error updating branding settings:', error);
      throw error;
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      console.log('Starting logo upload:', file.name, file.size, file.type);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      
      console.log('Upload filename:', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(fileName, file);

      console.log('Upload result:', { uploadData, uploadError });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(fileName);

      console.log('Generated public URL:', publicUrl);

      const updateResult = await updateSettings({ logo_url: publicUrl });
      console.log('Settings update result:', updateResult);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    uploadLogo,
    refetch: fetchSettings
  };
}