import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimeUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to homepage content changes
    const homepageSubscription = supabase
      .channel('homepage-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'homepage_content'
        },
        (payload) => {
          console.log('Homepage content changed:', payload);
          // Invalidate and refetch homepage content
          queryClient.invalidateQueries({ queryKey: ['homepage-content'] });
        }
      )
      .subscribe();

    // Subscribe to branding settings changes
    const brandingSubscription = supabase
      .channel('branding-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'branding_settings'
        },
        (payload) => {
          console.log('Branding settings changed:', payload);
          // Invalidate and refetch branding settings
          queryClient.invalidateQueries({ queryKey: ['branding-settings'] });
        }
      )
      .subscribe();

    // Subscribe to features content changes
    const featuresSubscription = supabase
      .channel('features-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'features_content'
        },
        (payload) => {
          console.log('Features content changed:', payload);
          // Invalidate and refetch features content
          queryClient.invalidateQueries({ queryKey: ['features-content'] });
        }
      )
      .subscribe();

    // Subscribe to pricing content changes
    const pricingSubscription = supabase
      .channel('pricing-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pricing_content'
        },
        (payload) => {
          console.log('Pricing content changed:', payload);
          // Invalidate and refetch pricing content
          queryClient.invalidateQueries({ queryKey: ['pricing-content'] });
        }
      )
      .subscribe();



    // Subscribe to contact content changes
    const contactSubscription = supabase
      .channel('contact-content-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contact_content'
        },
        (payload) => {
          console.log('Contact content changed:', payload);
          // Invalidate and refetch contact content
          queryClient.invalidateQueries({ queryKey: ['contact-content'] });
        }
      )
      .subscribe();

    // Subscribe to footer links changes
    const footerSubscription = supabase
      .channel('footer-links-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'footer_links'
        },
        (payload) => {
          console.log('Footer links changed:', payload);
          // Invalidate and refetch footer links
          queryClient.invalidateQueries({ queryKey: ['footer-links'] });
        }
      )
      .subscribe();

    return () => {
      // Cleanup subscriptions
      homepageSubscription.unsubscribe();
      brandingSubscription.unsubscribe();
      featuresSubscription.unsubscribe();
      pricingSubscription.unsubscribe();

      contactSubscription.unsubscribe();
      footerSubscription.unsubscribe();
    };
  }, [queryClient]);
} 