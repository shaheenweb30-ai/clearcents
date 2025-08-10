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

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const { shouldApplyDarkTheme } = useSettings();
  const { t } = useTranslation();
  const location = useLocation();
  const { isAdmin } = useUserRole(user);

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
            <div className="flex items-center gap-2 px-2">
              <Logo size="sm" />
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)}>
                          <Link to={item.href}>
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
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
              <SidebarGroupLabel>Financial</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {financialNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)}>
                          <Link to={item.href}>
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
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
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {accountNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)}>
                          <Link to={item.href}>
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Support */}
            <SidebarGroup>
              <SidebarGroupLabel>Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {supportNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive(item.href)}>
                          <Link to={item.href}>
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
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
                <SidebarGroupLabel>Administration</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {administrationNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton asChild isActive={isActive(item.href)}>
                            <Link to={item.href}>
                              <Icon className="h-4 w-4" />
                              <span>{item.name}</span>
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
                <SidebarGroupLabel>Admin</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {adminNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton asChild isActive={isActive(item.href)}>
                            <Link to={item.href}>
                              <Icon className="h-4 w-4" />
                              <span>{item.name}</span>
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
          <SidebarFooter className="border-t border-border">
            <div className="flex items-center gap-2 px-2 py-2">
              <UserProfileDropdown />
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
