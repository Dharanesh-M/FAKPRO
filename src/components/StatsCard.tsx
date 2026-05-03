import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

const VARIANT_STYLES = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

export function StatsCard({ title, value, icon: Icon, description, trend, variant = "default" }: StatsCardProps) {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">{title}</p>
            <p className="text-2xl font-heading font-bold">{value}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {trend && <p className="text-xs text-success font-medium">{trend}</p>}
          </div>
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${VARIANT_STYLES[variant]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
