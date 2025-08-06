import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Github } from "lucide-react";
import { AdminContentWrapper } from "@/components/admin/AdminContentWrapper";
import { useOptimizedHomepageContent } from "@/hooks/useOptimizedHomepageContent";
import { useFooterLinks } from "@/hooks/useFooterLinks";
import { FooterManager } from "@/components/admin/FooterManager";
import { useOptimizedBrandingSettings } from "@/hooks/useOptimizedBrandingSettings";
import { Logo } from "./Logo";

const Footer = () => {
  const { getContentBySection } = useOptimizedHomepageContent();
  const { getNavigationByGroup, getSocialLinks, loading } = useFooterLinks();
  const { settings: brandingSettings } = useOptimizedBrandingSettings();
  const footerContent = getContentBySection('footer');

  const navigationGroups = getNavigationByGroup();
  const socialLinks = getSocialLinks().sort((a, b) => a.display_order - b.display_order);

  // Helper function to get social icon component
  const getSocialIcon = (iconName: string) => {
    const iconMap = {
      facebook: Facebook,
      instagram: Instagram,
      twitter: Twitter,
      linkedin: Linkedin,
      youtube: Youtube,
      github: Github
    };
    const IconComponent = iconMap[iconName?.toLowerCase() as keyof typeof iconMap] || Facebook;
    return <IconComponent className="w-5 h-5" />;
  };

  // Helper function to render link (internal vs external)
  const renderLink = (link: { url: string; title: string }, className: string) => {
    const isInternal = link.url.startsWith('/');
    
    if (isInternal) {
      return (
        <Link to={link.url} className={className}>
          {link.title}
        </Link>
      );
    } else {
      return (
        <a 
          href={link.url} 
          className={className}
          target="_blank" 
          rel="noopener noreferrer"
        >
          {link.title}
        </a>
      );
    }
  };

  if (loading) {
    return (
      <footer className="bg-gray-50 text-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">Loading footer...</div>
        </div>
      </footer>
    );
  }

  return (
    <>
      <AdminContentWrapper sectionId="footer">
        <footer className="bg-gray-50 text-gray-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
              {/* Logo and tagline */}
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <Logo size="md" showText={true} />
                </div>
                <p 
                  className="font-body mb-6 max-w-sm"
                  style={{ color: footerContent?.description_color || '#6B7280' }}
                >
                  {footerContent?.description || 'Welcome to FinSuite, where financial management meets simplicity and efficiency.'}
                </p>
                
                {/* Dynamic Social Icons */}
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <a 
                      key={social.id}
                      href={social.url} 
                      className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.title}
                    >
                      {getSocialIcon(social.icon_name || 'facebook')}
                    </a>
                  ))}
                </div>
              </div>

              {/* Dynamic Navigation Groups */}
              {Object.keys(navigationGroups).slice(0, 4).map((groupName) => (
                <div key={groupName}>
                  <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">
                    {groupName}
                  </h3>
                  <ul className="space-y-3">
                    {navigationGroups[groupName].map((link) => (
                      <li key={link.id}>
                        {renderLink(
                          link,
                          "text-gray-600 hover:text-gray-900 font-body transition-colors"
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p 
                className="font-body text-sm"
                style={{ color: footerContent?.subtitle_color || '#6B7280' }}
              >
                {footerContent?.subtitle || '© 2024 All Rights Reserved'}
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-600 hover:text-gray-900 font-body text-sm transition-colors">
                  Terms & Conditions
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900 font-body text-sm transition-colors">
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </AdminContentWrapper>
      
      {/* Footer Manager for Admins */}
      <FooterManager />
    </>
  );
};

export default Footer;