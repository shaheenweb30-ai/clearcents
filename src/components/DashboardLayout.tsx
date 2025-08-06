import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { Logo } from "./Logo";
import { OnboardingProvider } from "./OnboardingProvider";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center">
                <SidebarTrigger className="h-8 w-8" />
                <div className="ml-4">
                  <Logo size="md" />
                </div>
              </div>
              <UserProfileDropdown />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <OnboardingProvider>
              {children}
            </OnboardingProvider>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}