import { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { blockchainService } from "@/services/blockchain";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QRCodeSVG } from "qrcode.react";
import { Package, CheckCircle, Loader2, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AddProductPage() {
  const { addProduct } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { position, loading: geoLoading, getCurrentPosition } = useGeolocation();
  const [created, setCreated] = useState<{ id: string; name: string; txHash: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", batch: "", origin: "", description: "",
    manufacturerDate: new Date().toISOString().split("T")[0],
  });

  const handleCaptureLocation = async () => {
    try {
      const pos = await getCurrentPosition();
      setForm(f => ({ ...f, origin: `${pos.latitude.toFixed(4)}, ${pos.longitude.toFixed(4)}` }));
      toast.success("Location captured for origin");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Capture geo
      let lat = 0, lng = 0;
      try {
        const pos = await getCurrentPosition();
        lat = pos.latitude;
        lng = pos.longitude;
      } catch {}

      const product = addProduct({
        ...form,
        imageUrl: "",
        manufacturer: user?.name || "Unknown",
      });

      // Push to blockchain
      const { txHash, simulated } = await blockchainService.createProductOnChain(
        product.id, form.name, form.batch, form.origin,
        user?.name || "Unknown", form.manufacturerDate,
        form.description, lat, lng, form.origin
      );

      setCreated({ id: product.id, name: product.name, txHash });
      toast.success(
        simulated
          ? "Product registered (simulated blockchain)"
          : `Product registered on blockchain! Tx: ${txHash.slice(0, 12)}...`
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to register product");
    } finally {
      setSubmitting(false);
    }
  };

  if (created) {
    return (
      <div className="max-w-md mx-auto space-y-6 animate-scale-in">
        <Card className="shadow-elevated text-center">
          <CardContent className="p-8 space-y-4">
            <div className="h-14 w-14 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle className="h-7 w-7 text-success" />
            </div>
            <h2 className="font-heading text-lg font-bold">Product Registered!</h2>
            <p className="text-sm text-muted-foreground">{created.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{created.id}</p>
            <div className="bg-card p-4 rounded-xl border inline-block">
              <QRCodeSVG value={created.id} size={180} level="H" />
            </div>
            <p className="text-xs text-muted-foreground">Scan this QR code to verify product authenticity</p>
            <div className="bg-muted/50 rounded-lg p-2 text-[10px] font-mono text-muted-foreground break-all">
              Tx: {created.txHash}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setCreated(null); setForm({ name: "", batch: "", origin: "", description: "", manufacturerDate: new Date().toISOString().split("T")[0] }); }}>
                Add Another
              </Button>
              <Button className="flex-1 gradient-primary text-primary-foreground" onClick={() => navigate(`/product/${created.id}`)}>
                View Product
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4 animate-fade-in">
      <div>
        <h1 className="font-heading text-xl font-bold flex items-center gap-2">
          <Package className="h-5 w-5 text-accent" /> Register New Product
        </h1>
        <p className="text-sm text-muted-foreground">Product data will be stored on the Ethereum blockchain</p>
      </div>

      {/* Wallet info */}
      {user?.walletAddress && (
        <div className="bg-muted/50 rounded-lg p-3 text-xs font-mono text-muted-foreground">
          Connected wallet: {user.walletAddress}
        </div>
      )}

      <Card className="shadow-card">
        <CardContent className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Product Name</Label>
              <Input required placeholder="e.g., Premium Wireless Headphones" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Batch Number</Label>
                <Input required placeholder="BATCH-2026-XX" value={form.batch} onChange={e => setForm({ ...form, batch: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Manufacture Date</Label>
                <Input type="date" required value={form.manufacturerDate} onChange={e => setForm({ ...form, manufacturerDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Origin / Location</Label>
              <div className="flex gap-2">
                <Input required placeholder="City, Country or GPS coordinates" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} className="flex-1" />
                <Button type="button" variant="outline" size="icon" onClick={handleCaptureLocation} disabled={geoLoading} title="Capture GPS location">
                  {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                </Button>
              </div>
              {position && (
                <p className="text-[10px] text-muted-foreground">
                  📍 {position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea placeholder="Product details..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Transaction...
                </>
              ) : (
                "Register on Blockchain"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
