import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { Logo } from "./Logo";
import { useOptimizedBrandingSettings } from "@/hooks/useOptimizedBrandingSettings";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: t('common.home'), href: "/" },
    { name: t('common.features'), href: "/features" },
    { name: t('common.pricing'), href: "/pricing" },
    { name: t('common.about'), href: "/about" },
    { name: t('common.contact'), href: "/contact" },
  ];

  return (
    <header className="bg-background shadow-sm border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-body font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons or User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">{t('common.loading')}</div>
            ) : user ? (
              <UserProfileDropdown />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="default" className="text-foreground hover:text-primary">
                    {t('common.login')}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="hero" size="default">
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
              className="text-foreground hover:text-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-body font-medium px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {loading ? (
                <div className="px-4 text-sm text-muted-foreground">{t('common.loading')}</div>
              ) : user ? (
                <div className="px-4 border-t pt-4">
                  <UserProfileDropdown />
                </div>
              ) : (
                <>
                  <Link to="/login" className="px-4">
                    <Button variant="ghost" size="default" className="w-full text-foreground hover:text-primary">
                      {t('common.login')}
                    </Button>
                  </Link>
                  <Link to="/signup" className="px-4">
                    <Button variant="hero" size="default" className="w-full">
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