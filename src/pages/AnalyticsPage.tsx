import { useProducts } from "@/contexts/ProductContext";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShieldCheck, AlertTriangle, Activity, Eye, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const COLORS = ["hsl(200 45% 45%)", "hsl(152 60% 40%)", "hsl(0 72% 51%)", "hsl(38 92% 50%)"];

export default function AnalyticsPage() {
  const { stats, products } = useProducts();

  const monthlyData = [
    { month: "Jan", registered: 8, verified: 22, fake: 1 },
    { month: "Feb", registered: 15, verified: 35, fake: 2 },
    { month: "Mar", registered: 22, verified: 48, fake: 3 },
    { month: "Apr", registered: 12, verified: 30, fake: 1 },
  ];

  const scanData = [
    { day: "Mon", scans: 45 }, { day: "Tue", scans: 62 }, { day: "Wed", scans: 38 },
    { day: "Thu", scans: 71 }, { day: "Fri", scans: 55 }, { day: "Sat", scans: 28 }, { day: "Sun", scans: 19 },
  ];

  const regionData = [
    { name: "Asia", value: 45 }, { name: "Europe", value: 25 },
    { name: "Americas", value: 20 }, { name: "Africa", value: 10 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-xl font-bold">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">System-wide monitoring and insights</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatsCard title="Total Products" value={stats.total} icon={Package} trend="+12%" />
        <StatsCard title="Verified Authentic" value={stats.authentic} icon={ShieldCheck} variant="success" />
        <StatsCard title="Counterfeits" value={stats.fake} icon={AlertTriangle} variant="destructive" />
        <StatsCard title="Total Scans" value={products.reduce((s, p) => s + p.scanCount, 0)} icon={Eye} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Monthly Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="registered" fill="hsl(200 45% 45%)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="verified" fill="hsl(152 60% 40%)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="fake" fill="hsl(0 72% 51%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Daily Scans</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scanData}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="scans" stroke="hsl(200 45% 45%)" fill="hsl(200 45% 45% / 0.15)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Products by Region</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={regionData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                    {regionData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Suspicious Activities</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {products.filter(p => p.suspicious || !p.isAuthentic).map(p => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg bg-destructive/5 border border-destructive/10">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.id} • Scanned {p.scanCount}x</p>
                  </div>
                </div>
              ))}
              {products.filter(p => p.suspicious || !p.isAuthentic).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No suspicious activities</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
