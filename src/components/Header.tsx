import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, Globe, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { Logo } from "./Logo";
import { useOptimizedBrandingSettings } from "@/hooks/useOptimizedBrandingSettings";
import { useTranslation } from "react-i18next";
import { smoothScrollTo, isHomePage } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (href === "/") {
      // For home page, scroll to top
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate("/");
      }
    } else if (href === "#contact") {
      // For contact, scroll to contact section
      if (isHomePage()) {
        smoothScrollTo('contact-section');
      } else {
        navigate('/');
        setTimeout(() => {
          smoothScrollTo('contact-section');
        }, 100);
      }
    } else {
      // For other pages, navigate (ScrollToTop component will handle scrolling)
      navigate(href);
    }
    
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: t('common.home'), href: "/" },
    { name: t('common.features'), href: "/features" },
    { name: t('common.pricing'), href: "/pricing" },
    { name: t('common.contact'), href: "#contact" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 sticky top-0 z-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-10 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-200 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-200 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/3 w-5 h-5 md:w-7 md:h-7 bg-green-200 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-1/4 left-1/4 w-4 h-4 md:w-5 md:h-5 bg-indigo-200 rounded-full opacity-15 animate-pulse"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="group">
            <Logo size="lg" className="group-hover:scale-105 transition-transform duration-300" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const isContact = item.href === "#contact";
              const active = !isContact && isActive(item.href);
              return (
                <button
                  key={item.name}
                  onClick={(e) => handleNavigation(item.href, e)}
                  className={`font-semibold transition-all duration-300 relative group px-3 py-2 rounded-lg ${
                    active
                      ? "text-blue-600 bg-blue-50 border border-blue-200"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                  {!active && (
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA Buttons or User Profile */}
          <div className="hidden md:flex items-center space-x-6">
            {loading ? (
              <div className="text-sm text-gray-500">{t('common.loading')}</div>
            ) : user ? (
              <UserProfileDropdown />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="default" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-semibold px-6 py-2">
                    {t('common.login')}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-base">
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t('common.getStarted')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 p-3 rounded-xl hover:bg-blue-50 transition-all duration-300"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-8 border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => {
                const isContact = item.href === "#contact";
                const active = !isContact && isActive(item.href);
                return (
                  <button
                    key={item.name}
                    onClick={(e) => {
                      handleNavigation(item.href, e);
                      setIsMenuOpen(false);
                    }}
                    className={`font-semibold px-4 py-4 rounded-xl transition-all duration-300 text-left ${
                      active
                        ? "text-blue-600 bg-blue-50 border border-blue-200"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
              
              {loading ? (
                <div className="px-4 text-sm text-gray-500">{t('common.loading')}</div>
              ) : user ? (
                <div className="px-4 border-t border-gray-200/50 pt-4">
                  <UserProfileDropdown />
                </div>
              ) : (
                <>
                  <Link to="/login" className="px-4">
                    <Button variant="ghost" size="default" className="w-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-semibold py-3">
                      {t('common.login')}
                    </Button>
                  </Link>
                  <Link to="/signup" className="px-4">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t('common.getStarted')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;