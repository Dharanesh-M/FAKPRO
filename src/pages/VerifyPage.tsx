import { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { blockchainService } from "@/services/blockchain";
import { QrScanner } from "@/components/QrScanner";
import { ProductTimeline } from "@/components/ProductTimeline";
import { ProductMap } from "@/components/ProductMap";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Search, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export default function VerifyPage() {
  const { verifyProduct } = useProducts();
  const { getCurrentPosition } = useGeolocation();
  const [productId, setProductId] = useState("");
  const [result, setResult] = useState<ReturnType<typeof verifyProduct> | null>(null);
  const [searched, setSearched] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [scanLocation, setScanLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleVerify = async (id?: string) => {
    const searchId = (id || productId).trim();
    if (!searchId) return;
    setVerifying(true);

    // Capture geolocation for every verification scan
    let lat = 0, lng = 0;
    try {
      const pos = await getCurrentPosition();
      lat = pos.latitude;
      lng = pos.longitude;
      setScanLocation({ lat, lng });
    } catch {
      setScanLocation(null);
    }

    // Record scan on blockchain
    try {
      await blockchainService.scanProductOnChain(searchId, lat, lng);
    } catch {}

    const p = verifyProduct(searchId);
    setResult(p);
    setSearched(true);
    setVerifying(false);

    if (p) {
      toast.success(p.isAuthentic ? "✓ Product verified as authentic" : "⚠ Counterfeit detected!");
    } else {
      toast.error("Product not found — possible counterfeit!");
    }
  };

  const handleQrScan = (decodedText: string) => {
    setProductId(decodedText);
    handleVerify(decodedText);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto">
          <Shield className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="font-heading text-2xl font-bold">Verify Product Authenticity</h1>
        <p className="text-sm text-muted-foreground">Scan QR code with your camera or enter a product ID</p>
      </div>

      {/* QR Camera Scanner */}
      <Card className="shadow-elevated">
        <CardContent className="p-5 space-y-4">
          <QrScanner onScan={handleQrScan} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or enter product ID</span></div>
          </div>

          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter Product ID (e.g., PRD-DEMO001)"
                className="pl-9"
                value={productId}
                onChange={e => setProductId(e.target.value)}
              />
            </div>
            <Button type="submit" className="gradient-primary text-primary-foreground" disabled={verifying}>
              {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
            </Button>
          </form>

          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Try:</span>
            {["PRD-DEMO001", "PRD-DEMO002", "PRD-FAKE001"].map(id => (
              <button key={id} onClick={() => { setProductId(id); handleVerify(id); }} className="text-xs text-accent hover:underline font-mono">{id}</button>
            ))}
          </div>

          {scanLocation && (
            <p className="text-[10px] text-muted-foreground text-center">
              📍 Scan location: {scanLocation.lat.toFixed(6)}, {scanLocation.lng.toFixed(6)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {searched && !result && (
        <Card className="border-destructive/30 bg-destructive/5 shadow-card animate-scale-in">
          <CardContent className="p-6 text-center space-y-3">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="font-heading text-xl font-bold text-destructive">⚠ Fake Product Detected!</h2>
            <p className="text-sm text-muted-foreground">
              This product ID is not registered on the blockchain. It may be counterfeit.
            </p>
          </CardContent>
        </Card>
      )}

      {result && !result.isAuthentic && (
        <Card className="border-destructive/30 bg-destructive/5 shadow-card animate-scale-in">
          <CardContent className="p-6 text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto animate-pulse-glow">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="font-heading text-xl font-bold text-destructive">⚠ Fake Product Detected!</h2>
            <p className="text-sm text-muted-foreground">
              This product has been flagged as counterfeit. Do not purchase.
            </p>
            <p className="text-xs text-muted-foreground">Scanned {result.scanCount} times • Reported as suspicious</p>
          </CardContent>
        </Card>
      )}

      {result && result.isAuthentic && (
        <div className="space-y-4 animate-fade-in">
          <Card className="border-success/30 bg-success/5 shadow-card">
            <CardContent className="p-6 flex items-center gap-4">
              <ShieldCheck className="h-10 w-10 text-success shrink-0" />
              <div>
                <h2 className="font-heading text-lg font-bold text-success">✓ Authentic Product</h2>
                <p className="text-sm text-muted-foreground">Verified on blockchain with {result.events.length} confirmed transactions</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-2 shadow-card">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-heading text-sm font-semibold">{result.name}</h3>
                <div className="text-sm space-y-1 text-muted-foreground">
                  <p>Batch: {result.batch}</p>
                  <p>Origin: {result.origin}</p>
                  <p>Manufacturer: {result.manufacturer}</p>
                  <p>Date: {result.manufacturerDate}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card flex items-center justify-center p-4">
              <QRCodeSVG value={result.id} size={120} level="H" />
            </Card>
          </div>

          <Card className="shadow-card">
            <CardContent className="p-5">
              <h3 className="font-heading text-sm font-semibold mb-3">Product Journey</h3>
              <ProductTimeline events={result.events} />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-5">
              <h3 className="font-heading text-sm font-semibold mb-3">Geo-Location Tracking</h3>
              <ProductMap events={result.events} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
