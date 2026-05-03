import { useProducts } from "@/contexts/ProductContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, ShieldCheck, AlertTriangle, Search, Eye } from "lucide-react";
import { useState } from "react";

export default function ProductsPage() {
  const { products } = useProducts();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} registered products</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.map(p => (
          <Card key={p.id} className="shadow-card hover:shadow-elevated transition-all cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${p.isAuthentic ? "bg-success/10" : "bg-destructive/10"}`}>
                  {p.isAuthentic ? <ShieldCheck className="h-5 w-5 text-success" /> : <AlertTriangle className="h-5 w-5 text-destructive" />}
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-sm font-semibold truncate">{p.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{p.id}</span>
                    <span>•</span>
                    <span>{p.batch}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={p.isAuthentic ? "default" : "destructive"} className="text-[10px]">
                  {p.isAuthentic ? "✓ Authentic" : "✗ Fake"}
                </Badge>
                <Badge variant="outline" className="text-[10px]">{p.events.length} events</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
