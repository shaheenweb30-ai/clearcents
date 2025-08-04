import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { AdminEditButton } from './AdminEditButton';
import { useHomepageContent } from '@/hooks/useHomepageContent';

interface AdminContentWrapperProps {
  sectionId: string;
  children: ReactNode;
  className?: string;
}

export function AdminContentWrapper({ sectionId, children, className = '' }: AdminContentWrapperProps) {
  const { user } = useAuth();
  const { isAdmin } = useUserRole(user);
  const { getContentBySection } = useHomepageContent();
  
  const currentContent = getContentBySection(sectionId);

  return (
    <div className={`relative ${className}`}>
      {isAdmin && (
        <AdminEditButton sectionId={sectionId} currentContent={currentContent} />
      )}
      {children}
    </div>
  );
}