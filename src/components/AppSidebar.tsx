import {
  Factory, Truck, Store, User, Shield, Package, QrCode, Map, BarChart3,
  LogOut, Wallet, Search, Bell, Home
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ROLE_ICONS: Record<UserRole, React.ElementType> = {
  manufacturer: Factory, supplier: Truck, retailer: Store, customer: User, admin: Shield,
};

const ROLE_COLORS: Record<UserRole, string> = {
  manufacturer: "bg-accent", supplier: "bg-info", retailer: "bg-success", customer: "bg-warning", admin: "bg-destructive",
};

const ROLE_MENUS: Record<UserRole, { title: string; url: string; icon: React.ElementType }[]> = {
  manufacturer: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Add Product", url: "/add-product", icon: Package },
    { title: "My Products", url: "/products", icon: QrCode },
    { title: "Track Products", url: "/track", icon: Map },
  ],
  supplier: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Scan Product", url: "/scan", icon: QrCode },
    { title: "Products", url: "/products", icon: Package },
    { title: "Track Shipments", url: "/track", icon: Map },
  ],
  retailer: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Scan Product", url: "/scan", icon: QrCode },
    { title: "Products", url: "/products", icon: Package },
    { title: "Track", url: "/track", icon: Map },
  ],
  customer: [
    { title: "Verify Product", url: "/verify", icon: Search },
    { title: "Scan QR Code", url: "/scan", icon: QrCode },
  ],
  admin: [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "All Products", url: "/products", icon: Package },
    { title: "Track Map", url: "/track", icon: Map },
    { title: "Alerts", url: "/alerts", icon: Bell },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  if (!user) return null;

  const RoleIcon = ROLE_ICONS[user.role];
  const items = ROLE_MENUS[user.role];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Branding */}
        <div className="p-4 border-b border-sidebar-border">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Shield className="h-4 w-4 text-accent-foreground" />
              </div>
              <div>
                <h2 className="font-heading text-sm font-bold text-sidebar-foreground">FINAL YEAR PROJECT</h2>
                <p className="text-[10px] text-sidebar-foreground/60">FAKE PRODUCT IDENTIFICATIONS</p>
              </div>
            </div>
          ) : (
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center mx-auto">
              <Shield className="h-4 w-4 text-accent-foreground" />
            </div>
          )}
        </div>

        {/* Wallet & Role info */}
        {!collapsed && (
          <div className="px-4 py-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full ${ROLE_COLORS[user.role]} flex items-center justify-center`}>
                <RoleIcon className="h-3.5 w-3.5 text-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-sidebar-border text-sidebar-foreground/70 capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
            {user.walletConnected && (
              <div className="flex items-center gap-1.5 text-[10px] text-sidebar-foreground/60 font-mono">
                <Wallet className="h-3 w-3 text-success" />
                <span>{user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-4)}</span>
              </div>
            )}
            {user.balance && (
              <p className="text-[10px] text-sidebar-foreground/50">{user.balance} ETH</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && (
                        <span className="flex items-center gap-2">
                          {item.title}
                          {item.title === "Alerts" && unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold">
                              {unreadCount}
                            </span>
                          )}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Public verify link */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50">Public</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/verify" className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                    <Search className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Verify Product</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <Button variant="ghost" size="sm" className="w-full text-xs text-sidebar-foreground/60" onClick={logout}>
          <LogOut className="mr-1.5 h-3.5 w-3.5" />
          {!collapsed && "Disconnect"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
