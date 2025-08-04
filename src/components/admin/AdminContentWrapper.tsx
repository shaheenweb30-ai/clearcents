import { ReactNode, CSSProperties } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { AdminEditButton } from './AdminEditButton';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { useFeaturesContent } from '@/hooks/useFeaturesContent';

interface AdminContentWrapperProps {
  sectionId: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  contentType?: 'homepage' | 'features';
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
  const { getContentBySection: getHomepageContent } = useHomepageContent();
  const { getContentBySection: getFeaturesContent } = useFeaturesContent();
  
  const currentContent = contentType === 'features' 
    ? getFeaturesContent(sectionId) 
    : getHomepageContent(sectionId);

  return (
    <div className={`relative ${className}`} style={style}>
      {isAdmin && (
        <AdminEditButton 
          sectionId={sectionId} 
          currentContent={currentContent} 
          contentType={contentType}
        />
      )}
      {children}
    </div>
  );
}