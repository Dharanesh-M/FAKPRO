import { ProductEvent } from "@/contexts/ProductContext";
import { Factory, Truck, Store, User, CheckCircle, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ROLE_ICON: Record<string, React.ElementType> = {
  Manufacturer: Factory, Supplier: Truck, Retailer: Store, Customer: User, Unknown: User,
};

export function ProductTimeline({ events }: { events: ProductEvent[] }) {
  return (
    <div className="space-y-0">
      {events.map((event, idx) => {
        const Icon = ROLE_ICON[event.role] || User;
        const isLast = idx === events.length - 1;
        return (
          <div key={event.id} className="flex gap-3 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="flex flex-col items-center">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
                event.status === "confirmed" ? "gradient-primary" : "bg-muted"
              }`}>
                <Icon className="h-4 w-4 text-primary-foreground" />
              </div>
              {!isLast && <div className="w-0.5 flex-1 min-h-[40px] bg-border" />}
            </div>
            <div className={`pb-6 flex-1 ${isLast ? "" : ""}`}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p className="font-heading text-sm font-semibold">{event.action}</p>
                  <p className="text-xs text-muted-foreground">{event.role}</p>
                </div>
                <Badge variant={event.status === "confirmed" ? "default" : "secondary"} className="text-[10px] gap-1">
                  {event.status === "confirmed" ? <CheckCircle className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                  {event.status}
                </Badge>
              </div>
              <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(event.timestamp).toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location.name}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground/70 font-mono truncate">
                Tx: {event.txHash.slice(0, 18)}...
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
