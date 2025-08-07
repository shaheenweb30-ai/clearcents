import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
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
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Transactions", href: "/transactions", icon: CreditCard },
    { name: "Categories", href: "/categories", icon: FileText },
    { name: "Insights", href: "/insights", icon: TrendingUp },
    { name: "My Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Subscription", href: "/subscription", icon: Package },
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

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-border">
          <div className="flex items-center gap-2 px-2">
            <Logo size="sm" />
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigation.map((item) => {
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

          {isAdminPage && (
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
  );
};

export default DashboardLayout;
