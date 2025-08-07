import { ReactNode } from "react";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { Logo } from "./Logo";


interface DashboardLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
}

export function DashboardLayout({ children, hideHeader = false }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {!hideHeader && (
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-16 items-center gap-4 px-6">
                <Logo />
                <div className="flex-1" />
                <UserProfileDropdown />
              </div>
            </header>
          )}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}