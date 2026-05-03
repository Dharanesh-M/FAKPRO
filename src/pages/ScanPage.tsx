import { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useGeolocation } from "@/hooks/useGeolocation";
import { blockchainService } from "@/services/blockchain";
import { QrScanner } from "@/components/QrScanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Package, MapPin, CheckCircle, Loader2, Navigation } from "lucide-react";
import { toast } from "sonner";

export default function ScanPage() {
  const { getProduct, addEvent } = useProducts();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const { position, loading: geoLoading, getCurrentPosition } = useGeolocation();
  const [productId, setProductId] = useState("");
  const [scannedProduct, setScannedProduct] = useState<ReturnType<typeof getProduct>>(undefined);
  const [action, setAction] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleScan = (id?: string) => {
    const searchId = (id || productId).trim();
    const p = getProduct(searchId);
    if (p) {
      setScannedProduct(p);
      setProductId(searchId);
      toast.success("Product found!");
      // Auto-capture geolocation
      getCurrentPosition().then(pos => {
        setLocation(`${pos.latitude.toFixed(4)}, ${pos.longitude.toFixed(4)}`);
      }).catch(() => {});
    } else {
      toast.error("Product not found — possible counterfeit!");
    }
  };

  const handleQrScan = (decodedText: string) => {
    setProductId(decodedText);
    handleScan(decodedText);
  };

  const handleCaptureLocation = async () => {
    try {
      const pos = await getCurrentPosition();
      setLocation(`${pos.latitude.toFixed(4)}, ${pos.longitude.toFixed(4)}`);
      toast.success(`Location captured: ${pos.latitude.toFixed(4)}, ${pos.longitude.toFixed(4)}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdate = async () => {
    if (!scannedProduct || !action || !location) return;
    setSubmitting(true);

    try {
      // Get current geo position
      let lat = 0, lng = 0;
      try {
        const pos = await getCurrentPosition();
        lat = pos.latitude;
        lng = pos.longitude;
      } catch {
        // Parse from location input if geolocation fails
        const parts = location.split(",").map(s => parseFloat(s.trim()));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          lat = parts[0];
          lng = parts[1];
        }
      }

      // Push to blockchain (or simulate)
      const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Unknown";
      const { txHash, simulated } = await blockchainService.addEventOnChain(
        scannedProduct.id, role, action, lat, lng, location
      );

      addEvent(scannedProduct.id, {
        role,
        action,
        timestamp: new Date().toISOString(),
        location: { lat, lng, name: location },
      });

      addNotification({
        type: "update",
        title: "Product Updated",
        message: `${scannedProduct.name} (${scannedProduct.id}) updated: "${action}" by ${role} at ${location}`,
        productId: scannedProduct.id,
      });

      toast.success(
        simulated
          ? "Transaction submitted (simulated blockchain)"
          : `Transaction confirmed! Hash: ${txHash.slice(0, 12)}...`
      );

      setTimeout(() => navigate(`/product/${scannedProduct.id}`), 1500);
    } catch (err: any) {
      toast.error(err.message || "Transaction failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 animate-fade-in">
      <div>
        <h1 className="font-heading text-xl font-bold flex items-center gap-2">
          <QrCode className="h-5 w-5 text-accent" /> Scan Product
        </h1>
        <p className="text-sm text-muted-foreground">Scan QR code or enter product ID to update the supply chain</p>
      </div>

      {/* Camera QR Scanner */}
      <Card className="shadow-card">
        <CardContent className="p-5 space-y-4">
          <QrScanner onScan={handleQrScan} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or enter manually</span></div>
          </div>

          <div className="flex gap-2">
            <Input placeholder="Enter Product ID" value={productId} onChange={e => setProductId(e.target.value)} />
            <Button onClick={() => handleScan()} className="gradient-primary text-primary-foreground shrink-0">Scan</Button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Quick:</span>
            {["PRD-DEMO001", "PRD-DEMO002"].map(id => (
              <button key={id} onClick={() => { setProductId(id); handleScan(id); }} className="text-xs text-accent hover:underline font-mono">{id}</button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Update form */}
      {scannedProduct && (
        <Card className="shadow-card animate-scale-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="h-4 w-4 text-accent" />
              {scannedProduct.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground font-mono">{scannedProduct.id}</p>

            {/* Wallet info */}
            {user?.walletAddress && (
              <div className="bg-muted/50 rounded-lg p-2 text-xs font-mono text-muted-foreground">
                Wallet: {user.walletAddress.slice(0, 10)}...{user.walletAddress.slice(-6)}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">Action / Status Update</Label>
              <Input placeholder="e.g., Received & Inspected" value={action} onChange={e => setAction(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Location
              </Label>
              <div className="flex gap-2">
                <Input placeholder="Auto-captured or enter manually" value={location} onChange={e => setLocation(e.target.value)} className="flex-1" />
                <Button variant="outline" size="icon" onClick={handleCaptureLocation} disabled={geoLoading} title="Capture GPS location">
                  {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                </Button>
              </div>
              {position && (
                <p className="text-[10px] text-muted-foreground">
                  📍 {position.latitude.toFixed(6)}, {position.longitude.toFixed(6)} (accuracy: {position.accuracy.toFixed(0)}m)
                </p>
              )}
            </div>
            <Button
              onClick={handleUpdate}
              className="w-full gradient-primary text-primary-foreground"
              disabled={!action || !location || submitting}
            >
              {submitting ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-1.5 h-4 w-4" />
              )}
              {submitting ? "Signing Transaction..." : "Confirm & Push to Blockchain"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
