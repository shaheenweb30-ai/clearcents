import { useLocation, useNavigate, NavLink, Link } from "react-router-dom";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  Receipt, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  User,
  Sparkles,
  DollarSign,
  Crown
} from "lucide-react";
import { useOptimizedBrandingSettings } from "@/hooks/useOptimizedBrandingSettings";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Transactions", url: "/transactions", icon: Receipt },
  { title: "Categories", url: "/categories", icon: FolderOpen },
  { title: "Insights", url: "/insights", icon: BarChart3 },
];

const bottomItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Subscription", url: "/subscription", icon: Crown },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";
  const { toast } = useToast();
  const { settings: brandingSettings } = useOptimizedBrandingSettings();

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary border-l-4 border-primary shadow-lg" 
      : "hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/50 text-gray-700 hover:text-gray-900";

  return (
    <Sidebar collapsible="icon" className="backdrop-blur-xl bg-white/80 border-r border-gray-200/50">
      <SidebarContent className="flex flex-col h-full p-4">

        {/* Logo/Brand Section */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl border border-gray-200/50">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {brandingSettings?.logo_url ? (
              <img 
                src={brandingSettings.logo_url} 
                alt={brandingSettings.business_name || "Logo"} 
                className="w-10 h-10 w-auto object-contain"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            )}
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {brandingSettings?.business_name || 'ClearCents'}
                </h2>
                <p className="text-xs text-gray-500">Financial Freedom</p>
              </div>
            )}
          </Link>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2 mb-2">
            {!isCollapsed && "Financial Tracking"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => `group flex items-center px-4 py-3 rounded-xl mx-1 transition-all duration-300 ease-out ${getNavClass({ isActive })}`}
                    >
                      <div className="relative">
                        <item.icon className="h-5 w-5 mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        {location.pathname === item.url && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                        )}
                      </div>
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium block">{item.title}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2 mb-2">
            {!isCollapsed && "Account"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => `group flex items-center px-4 py-3 rounded-xl mx-1 transition-all duration-300 ease-out ${getNavClass({ isActive })}`}
                    >
                      <item.icon className="h-5 w-5 mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium block">{item.title}</span>
                        </div>
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