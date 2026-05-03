import { useProducts } from "@/contexts/ProductContext";
import { ProductMap } from "@/components/ProductMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { useState } from "react";

export default function TrackPage() {
  const { products } = useProducts();
  const [selectedId, setSelectedId] = useState(products[0]?.id || "");
  const selected = products.find(p => p.id === selectedId);

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="font-heading text-xl font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-accent" /> Geo-Location Tracking
        </h1>
        <p className="text-sm text-muted-foreground">Track product movement across the supply chain</p>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="text-sm">Product Map</CardTitle>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {selected ? (
            <ProductMap events={selected.events} />
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Select a product to view its tracking map
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Location History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selected.events.map((e, idx) => (
                <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 text-sm">
                  <span className="h-6 w-6 rounded-full gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs">{e.location.name}</p>
                    <p className="text-[10px] text-muted-foreground">{e.role} • {e.action}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground shrink-0">
                    {new Date(e.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
