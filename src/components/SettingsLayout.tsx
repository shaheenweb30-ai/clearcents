import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  User, 
  LayoutDashboard,
  ChevronRight,
  Receipt,
  Tag,
  PiggyBank,
  Lightbulb
} from "lucide-react";
import { Logo } from "./Logo";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { OnboardingProvider } from "./OnboardingProvider";
import { useTranslation } from "react-i18next";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useToast } from "@/hooks/use-toast";

interface SettingsLayoutProps {
  children: ReactNode;
  activeTab?: string;
}

export function SettingsLayout({ children, activeTab }: SettingsLayoutProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetOnboarding } = useOnboarding();
  const { toast } = useToast();
  
  const navigationItems = [
    {
      name: t('navigation.dashboard'),
      href: "/dashboard",
      icon: LayoutDashboard,
      description: t('dashboard.description')
    },
    {
      name: t('navigation.transactions'),
      href: "/transactions",
      icon: Receipt,
      description: t('transactions.description')
    },
    {
      name: t('navigation.categories'),
      href: "/categories",
      icon: Tag,
      description: t('categories.description')
    },
    {
      name: t('navigation.budget'),
      href: "/budget",
      icon: PiggyBank,
      description: t('budget.description')
    },
    {
      name: t('common.profile'),
      href: "/settings?tab=profile",
      icon: User,
      description: t('settings.description')
    },
    {
      name: t('common.settings'),
      href: "/settings?tab=settings",
      icon: Settings,
      description: t('settings.description')
    }
  ];
  const location = useLocation();
  const currentPath = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'settings';

  const isActive = (path: string) => {
    if (path.includes('?tab=')) {
      const tabParam = path.split('?tab=')[1];
      return currentTab === tabParam;
    }
    return currentPath === path;
  };

  const handleNeedHelp = () => {
    // Reset onboarding to start fresh
    resetOnboarding();
    
    // Navigate to dashboard to start the journey
    navigate('/dashboard');
    
    // Show toast notification
    toast({
      title: "Onboarding Restarted! 🎉",
      description: "The guided tour has been restarted. Follow the tips to learn how to use ClearCents.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center">
            <Logo size="md" />
          </div>
          <UserProfileDropdown />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 min-h-[calc(100vh-4rem)] rtl:border-l rtl:border-r-0 overflow-hidden">
          <div className="p-4">
            <h2 className="font-heading font-semibold text-lg mb-4 px-2">Navigation</h2>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className={`w-full justify-start h-auto p-3 ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center w-full min-w-0">
                        <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium truncate">{item.name}</div>
                          <div className="text-xs opacity-70 truncate">{item.description}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 ml-2 flex-shrink-0" />
                      </div>
                    </Button>
                  </Link>
                );
              })}
              
              {/* Help Section */}
              <div className="mt-6 pt-4 border-t border-border">
                <h3 className="font-heading font-semibold text-sm mb-3 px-2 text-muted-foreground">Help & Support</h3>
                <Button
                  variant="ghost"
                  onClick={handleNeedHelp}
                  className="w-full justify-start h-auto p-3 hover:bg-blue-50 text-blue-700 hover:text-blue-800"
                >
                  <div className="flex items-center w-full min-w-0">
                    <Lightbulb className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium truncate">Need help?</div>
                      <div className="text-xs opacity-70 truncate">Restart guided tour</div>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-2 flex-shrink-0" />
                  </div>
                </Button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <OnboardingProvider>
            <div className="p-6">
              {children}
            </div>
          </OnboardingProvider>
        </main>
      </div>
    </div>
  );
} 