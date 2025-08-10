import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useTranslation } from "react-i18next";
import { useUserRole } from "@/hooks/useUserRole";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { Logo } from "./Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Brain,
  CreditCard,
  FileText,
  Home,
  Settings,
  User,
  HelpCircle,
  Package,
  Palette,
  Image,
  FileCode,
  Users,
  LogOut,
  TrendingUp,
  MessageSquare,
  Mail,
  Target,
} from "lucide-react";
import { useTrial } from "@/hooks/useTrial";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const { shouldApplyDarkTheme } = useSettings();
  const { t } = useTranslation();
  const location = useLocation();
  const { isAdmin } = useUserRole(user);
  const { isTrialActive, loading: loadingTrial } = useTrial(user);

  const isActive = (path: string) => location.pathname === path;

  // Apply dark theme class to the dashboard layout
  const dashboardClassName = shouldApplyDarkTheme() ? 'dark' : '';

  const mainNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
  ];

  const financialNavigation = [
    { name: "Transactions", href: "/transactions", icon: CreditCard },
    { name: "Categories & Budget", href: "/categories-budget", icon: Target },
    { name: "Reports", href: "/reports", icon: BarChart3 },
  ];

  const accountNavigation = [
    { name: "My Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Subscription", href: "/subscription", icon: Package },
  ];

  const supportNavigation = [
    { name: "Help & Support", href: "/help", icon: HelpCircle },
  ];

  const adminNavigation = [
    { name: "Page Management", href: "/admin/pages", icon: FileCode },
    { name: "Branding & Theme", href: "/admin/branding", icon: Palette },
    { name: "Image Gallery", href: "/admin/images", icon: Image },
    { name: "Footer Links", href: "/admin/footer", icon: FileText },
    { name: "FAQ Management", href: "/admin/faq", icon: HelpCircle },
    { name: "Package Settings", href: "/admin/packages", icon: Package },
  ];

  const administrationNavigation = [
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Form Submissions", href: "/settings?tab=admin", icon: MessageSquare },
    { name: "Newsletter Subscribers", href: "/settings?tab=newsletter", icon: Mail },
    { name: "Comparison Configurator", href: "/admin/comparison", icon: FileText },
  ];
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className={dashboardClassName}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="border-b border-border">
            <div className="flex items-center gap-2 px-2 py-2">
              <Logo size="sm" className="w-8 h-8 sm:w-10 sm:h-10" />
              <SidebarTrigger className="hidden sm:block" />
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2">
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs sm:text-sm font-medium text-muted-foreground px-2 py-1">Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)} className="text-sm sm:text-base">
                          <Link to={item.href}>
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="hidden sm:inline">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Financial Management */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs sm:text-sm font-medium text-muted-foreground px-2 py-1">Financial</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {financialNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)} className="text-sm sm:text-base">
                          <Link to={item.href}>
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="hidden sm:inline">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Account Management */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs sm:text-sm font-medium text-muted-foreground px-2 py-1">Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {accountNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)} className="text-sm sm:text-base">
                          <Link to={item.href}>
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="hidden sm:inline">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                        {item.href === '/subscription' && !loadingTrial && (
                          <SidebarMenuBadge className={`text-xs px-2 py-1 ${isTrialActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                            {isTrialActive ? 'Trial' : 'Free'}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Support */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs sm:text-sm font-medium text-muted-foreground px-2 py-1">Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {supportNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)} className="text-sm sm:text-base">
                          <Link to={item.href}>
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="hidden sm:inline">{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Administration - Admin Only */}
            {isAdmin && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs sm:text-sm font-medium text-muted-foreground px-2 py-1">Administration</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {administrationNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton asChild isActive={isActive(item.href)} className="text-sm sm:text-base">
                            <Link to={item.href}>
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="hidden sm:inline">{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {isAdmin && isAdminPage && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs sm:text-sm font-medium text-muted-foreground px-2 py-1">Admin</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton asChild isActive={isActive(item.href)} className="text-sm sm:text-base">
                            <Link to={item.href}>
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="hidden sm:inline">{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>
          <SidebarFooter className="border-t border-border px-2 py-2">
            <div className="flex items-center gap-2">
              <UserProfileDropdown />
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
