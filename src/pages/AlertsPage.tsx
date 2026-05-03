import { useNotifications } from "@/contexts/NotificationContext";
import { useProducts } from "@/contexts/ProductContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell, AlertTriangle, ShieldCheck, Clock, ArrowRightLeft,
  Package, CheckCheck, Trash2, Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TYPE_CONFIG = {
  counterfeit: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
  suspicious: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  transfer: { icon: ArrowRightLeft, color: "text-accent", bg: "bg-accent/10", border: "" },
  scan: { icon: Eye, color: "text-info", bg: "bg-info/10", border: "" },
  update: { icon: Package, color: "text-muted-foreground", bg: "bg-muted", border: "" },
  system: { icon: ShieldCheck, color: "text-accent", bg: "bg-accent/10", border: "" },
};

export default function AlertsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const navigate = useNavigate();

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-accent" /> Alerts & Notifications
          </h1>
          <p className="text-sm text-muted-foreground">
            {notifications.length} notifications • {unreadCount} unread
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={markAllAsRead}>
              <CheckCheck className="h-3.5 w-3.5" /> Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-destructive" onClick={clearAll}>
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-8 text-center">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const config = TYPE_CONFIG[n.type];
            const Icon = config.icon;
            return (
              <Card
                key={n.id}
                className={`shadow-card transition-all cursor-pointer hover:shadow-elevated ${config.border} ${!n.read ? "bg-accent/5" : ""}`}
                onClick={() => {
                  markAsRead(n.id);
                  if (n.productId) navigate(`/product/${n.productId}`);
                }}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${config.bg}`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-heading font-semibold ${!n.read ? "" : "text-muted-foreground"}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-accent" />}
                      <Badge variant={
                        n.type === "counterfeit" ? "destructive" :
                        n.type === "suspicious" ? "secondary" :
                        n.type === "transfer" ? "default" : "outline"
                      } className="text-[10px]">
                        {n.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    {n.from && n.to && (
                      <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                        {n.from} → {n.to}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> {formatTime(n.timestamp)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
