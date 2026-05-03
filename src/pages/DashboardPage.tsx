import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import { StatsCard } from "@/components/StatsCard";
import { Package, ShieldCheck, AlertTriangle, Activity, Factory, Truck, Store, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const PIE_COLORS = ["hsl(200 45% 45%)", "hsl(152 60% 40%)", "hsl(0 72% 51%)", "hsl(38 92% 50%)"];

export default function DashboardPage() {
  const { user } = useAuth();
  const { products, stats } = useProducts();
  const navigate = useNavigate();

  const barData = [
    { name: "Jan", products: 12 }, { name: "Feb", products: 19 },
    { name: "Mar", products: 28 }, { name: "Apr", products: 15 },
  ];

  const pieData = [
    { name: "Authentic", value: stats.authentic },
    { name: "Fake", value: stats.fake },
    { name: "Suspicious", value: stats.suspicious },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-heading text-xl font-bold">
          Welcome, {user?.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {user?.role === "admin" ? "System overview and analytics" : `${user?.role} dashboard`}
        </p>
        {user?.walletAddress && (
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Wallet: {user.walletAddress}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatsCard title="Total Products" value={stats.total} icon={Package} trend="+12% this month" />
        <StatsCard title="Authentic" value={stats.authentic} icon={ShieldCheck} variant="success" />
        <StatsCard title="Fake Detected" value={stats.fake} icon={AlertTriangle} variant="destructive" />
        <StatsCard title="Transactions" value={stats.transactions} icon={Activity} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Chart */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Products Registered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="products" fill="hsl(200 45% 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Product Authenticity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent products */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Recent Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {products.slice(0, 5).map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => navigate(`/product/${p.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${p.isAuthentic ? "bg-success/10" : "bg-destructive/10"}`}>
                    {p.isAuthentic ? <ShieldCheck className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={p.isAuthentic ? "default" : "destructive"} className="text-[10px]">
                    {p.isAuthentic ? "Authentic" : "Fake"}
                  </Badge>
                  {p.suspicious && (
                    <Badge variant="secondary" className="text-[10px] text-warning">⚠ Suspicious</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
