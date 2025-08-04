import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HomepageContent {
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
  image_url: string | null;
}

export function useHomepageContent() {
  const [content, setContent] = useState<HomepageContent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_content')
        .select('*')
        .order('section_id');

      if (error) {
        console.error('Error fetching homepage content:', error);
      } else {
        setContent(data || []);
      }
    } catch (error) {
      console.error('Error fetching homepage content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateContent = async (sectionId: string, updates: Partial<HomepageContent>) => {
    try {
      // First check if the section exists
      const { data: existingData } = await supabase
        .from('homepage_content')
        .select('id')
        .eq('section_id', sectionId)
        .maybeSingle();

      let result;
      
      if (existingData) {
        // Update existing content
        const { data, error } = await supabase
          .from('homepage_content')
          .update(updates)
          .eq('section_id', sectionId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new content
        const { data, error } = await supabase
          .from('homepage_content')
          .insert([{ section_id: sectionId, ...updates }])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      // Update local state
      setContent(prev => {
        const existingIndex = prev.findIndex(item => item.section_id === sectionId);
        if (existingIndex >= 0) {
          // Update existing
          return prev.map(item => 
            item.section_id === sectionId ? { ...item, ...result } : item
          );
        } else {
          // Add new
          return [...prev, result];
        }
      });

      return result;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  };

  const getContentBySection = (sectionId: string) => {
    return content.find(item => item.section_id === sectionId);
  };

  return {
    content,
    loading,
    updateContent,
    getContentBySection,
    refetch: fetchContent
  };
}