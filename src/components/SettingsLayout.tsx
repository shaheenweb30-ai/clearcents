import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  User, 
  LayoutDashboard,
  ChevronRight,
  Receipt,
  Tag,
  PiggyBank
} from "lucide-react";
import { Logo } from "./Logo";
import { UserProfileDropdown } from "./UserProfileDropdown";

interface SettingsLayoutProps {
  children: ReactNode;
  activeTab?: string;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your finances"
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: Receipt,
    description: "Manage your transactions"
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Tag,
    description: "Manage your spending categories"
  },
  {
    name: "Budget",
    href: "/budget",
    icon: PiggyBank,
    description: "Manage your budgets"
  },
  {
    name: "Profile",
    href: "/settings?tab=profile",
    icon: User,
    description: "Manage your account"
  },
  {
    name: "Settings",
    href: "/settings?tab=settings",
    icon: Settings,
    description: "Configure your preferences"
  }
];

export function SettingsLayout({ children, activeTab }: SettingsLayoutProps) {
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
        <aside className="w-64 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 min-h-[calc(100vh-4rem)]">
          <div className="p-6">
            <h2 className="font-heading font-semibold text-lg mb-4">Navigation</h2>
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className={`w-full justify-start h-auto p-4 ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center w-full">
                        <Icon className="w-5 h-5 mr-3" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </div>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 