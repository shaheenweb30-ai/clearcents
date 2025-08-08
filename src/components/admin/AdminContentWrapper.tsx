import { ReactNode, CSSProperties } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { AdminEditButton } from './AdminEditButton';
import { useOptimizedHomepageContent } from '@/hooks/useOptimizedHomepageContent';
import { useFeaturesContent } from '@/hooks/useFeaturesContent';
import { useOptimizedPricingContent } from '@/hooks/useOptimizedPricingContent';

interface AdminContentWrapperProps {
  sectionId: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  contentType?: 'homepage' | 'features' | 'pricing';
}

export function AdminContentWrapper({ 
  sectionId, 
  children, 
  className = '', 
  style,
  contentType = 'homepage'
}: AdminContentWrapperProps) {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  
  console.log('AdminContentWrapper Debug:', {
    sectionId,
    contentType,
    user: user?.email,
    isAdmin,
    userId: user?.id
  });
  const { getContentBySection: getHomepageContent, updateContent: updateHomepageContent, refetch: refetchHomepage } = useOptimizedHomepageContent();
  const { getContentBySection: getFeaturesContent, updateContent: updateFeaturesContent, refetch: refetchFeatures } = useFeaturesContent();
  const { getContentBySection: getPricingContent, updateContent: updatePricingContent, refetch: refetchPricing } = useOptimizedPricingContent();
  const { getContentBySection: getAboutContent, updateContent: updateAboutContent, refetch: refetchAbout } = useOptimizedAboutContent();
  
  const currentContent = contentType === 'features' 
    ? getFeaturesContent(sectionId) 
    : contentType === 'pricing'
    ? getPricingContent(sectionId)
    : contentType === 'about'
    ? getAboutContent(sectionId)
    : getHomepageContent(sectionId);

  const updateFunction = contentType === 'features' 
    ? updateFeaturesContent 
    : contentType === 'pricing'
    ? updatePricingContent
    : contentType === 'about'
    ? updateAboutContent
    : updateHomepageContent;

  const refetchFunction = contentType === 'features' 
    ? refetchFeatures 
    : contentType === 'pricing'
    ? refetchPricing
    : contentType === 'about'
    ? refetchAbout
    : refetchHomepage;

  return (
    <div className={`relative ${className}`} style={style}>
      {isAdmin && (
        <AdminEditButton 
          sectionId={sectionId} 
          currentContent={currentContent} 
          contentType={contentType}
          updateContent={updateFunction}
          refetch={refetchFunction}
        />
      )}
      {children}
    </div>
  );
}