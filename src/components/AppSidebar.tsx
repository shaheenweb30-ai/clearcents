import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Settings, 
  User,
  Tag,
  BarChart3,
  PiggyBank,
  Lightbulb
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useToast } from "@/hooks/use-toast";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Transactions", url: "/transactions", icon: TrendingUp },
  { title: "Categories", url: "/categories", icon: Tag },
  { title: "Budget", url: "/budget", icon: PiggyBank },
  { title: "Insights", url: "/insights", icon: BarChart3 },
];

const bottomItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";
  const { resetOnboarding } = useOnboarding();
  const { toast } = useToast();

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50 text-foreground";

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
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent className="flex flex-col h-full">
        {/* Main Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-sm font-heading font-book text-muted-foreground px-4 py-2">
            Financial Tracking
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${getNavClass({ isActive })}`}
                    >
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-body">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Help Section */}
        <SidebarGroup className="border-t border-border pt-4">
          <SidebarGroupLabel className="text-sm font-heading font-book text-muted-foreground px-4 py-2">
            Help & Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleNeedHelp}
                  className="flex items-center px-4 py-3 rounded-lg mx-2 transition-all duration-200 hover:bg-blue-50 text-blue-700 hover:text-blue-800"
                >
                  <Lightbulb className="h-5 w-5 mr-3 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="text-sm font-body">Need help?</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Navigation */}
        <SidebarGroup className="mt-auto border-t border-border pt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${getNavClass({ isActive })}`}
                    >
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-body">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}