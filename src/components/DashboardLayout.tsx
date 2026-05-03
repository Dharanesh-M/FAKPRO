import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
                <Shield className="h-3.5 w-3.5 text-accent" />
                <span className="font-heading font-semibold text-foreground">DASHBOARDS</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <Badge variant="outline" className="text-xs gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
                  {user.walletConnected ? "Wallet Connected" : "Wallet Disconnected"}
                </Badge>
              )}
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-destructive border-2 border-card" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
