import { useState } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { ProductTimeline } from "@/components/ProductTimeline";
import { ProductMap } from "@/components/ProductMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeSVG } from "qrcode.react";
import {
  ShieldCheck, AlertTriangle, MapPin, Calendar, Factory, Hash, Package,
  ArrowRightLeft, Wallet, Loader2, CheckCircle, Clock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { blockchainService } from "@/services/blockchain";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getProduct, transferOwnership } = useProducts();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const product = getProduct(id || "");
  const [transferTo, setTransferTo] = useState("");
  const [transferRole, setTransferRole] = useState("");
  const [transferring, setTransferring] = useState(false);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const handleTransfer = async () => {
    if (!transferTo || !transferRole) return;
    setTransferring(true);
    try {
      await blockchainService.addEventOnChain(
        product.id, user?.role || "unknown",
        `Ownership Transfer → ${transferRole}`, 0, 0, "On-chain"
      );
      transferOwnership(product.id, transferTo, transferRole);
      addNotification({
        type: "transfer",
        title: "Ownership Transferred",
        message: `${product.name} (${product.id}) transferred to ${transferTo.slice(0, 10)}... as ${transferRole}`,
        productId: product.id,
        from: user?.walletAddress || product.currentOwner,
        to: transferTo,
      });
      toast.success(`Ownership transferred to ${transferRole}`);
      setTransferTo("");
      setTransferRole("");
    } catch (err: any) {
      toast.error(err.message || "Transfer failed");
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Status banner */}
      <Card className={`${product.isAuthentic ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"} shadow-card`}>
        <CardContent className="p-4 flex items-center gap-3">
          {product.isAuthentic ? (
            <>
              <ShieldCheck className="h-8 w-8 text-success" />
              <div>
                <p className="font-heading font-bold text-success">Authentic Product</p>
                <p className="text-xs text-muted-foreground">Verified on blockchain • {product.events.length} transactions</p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <p className="font-heading font-bold text-destructive">⚠ Fake Product Detected</p>
                <p className="text-xs text-muted-foreground">This product could not be verified</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Product info */}
        <Card className="shadow-card md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              {product.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">ID:</span>
                <span className="font-mono text-xs">{product.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Batch:</span>
                <span>{product.batch}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Origin:</span>
                <span>{product.origin}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
                <span>{product.manufacturerDate}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <Factory className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Manufacturer:</span>
                <span>{product.manufacturer}</span>
              </div>
            </div>

            {/* Current Owner */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-1">
              <p className="text-xs font-medium flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-accent" /> Current Owner
              </p>
              <p className="text-sm font-mono">{product.currentOwner}</p>
              <Badge variant="outline" className="text-[10px] capitalize">{product.currentOwnerRole}</Badge>
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground">{product.description}</p>
            )}
            <div className="flex gap-2">
              <Badge variant={product.isAuthentic ? "default" : "destructive"}>
                {product.isAuthentic ? "Authentic" : "Counterfeit"}
              </Badge>
              {product.suspicious && <Badge variant="secondary" className="text-warning">Suspicious Activity</Badge>}
              <Badge variant="outline">Scanned {product.scanCount}x</Badge>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">QR Code</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-3">
            <div className="bg-card p-3 rounded-xl border">
              <QRCodeSVG value={product.id} size={150} level="H" />
            </div>
            <p className="text-[10px] text-muted-foreground font-mono">{product.id}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="timeline">
        <TabsList>
          <TabsTrigger value="timeline">Journey Timeline</TabsTrigger>
          <TabsTrigger value="ownership">Ownership History</TabsTrigger>
          <TabsTrigger value="map">Geo Tracking</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-3">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Product Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductTimeline events={product.events} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ownership" className="mt-3">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-accent" /> Ownership Transfer History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.ownership.length === 0 ? (
                <p className="text-sm text-muted-foreground">No ownership records</p>
              ) : (
                <div className="space-y-3">
                  {product.ownership.map((record, i) => (
                    <div key={record.id} className="relative pl-6 pb-3 border-l-2 border-accent/30 last:border-transparent">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-accent flex items-center justify-center">
                        <span className="text-[8px] text-accent-foreground font-bold">{i + 1}</span>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px] capitalize">{record.fromRole}</Badge>
                          <span className="text-xs text-muted-foreground">→</span>
                          <Badge className="text-[10px] capitalize">{record.toRole}</Badge>
                          <Badge variant={record.status === "confirmed" ? "default" : "secondary"} className="text-[10px] ml-auto">
                            {record.status === "confirmed" ? <CheckCircle className="h-2.5 w-2.5 mr-1" /> : <Clock className="h-2.5 w-2.5 mr-1" />}
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">From: {record.from}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">To: {record.to}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">Tx: {record.txHash.slice(0, 20)}...</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(record.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map" className="mt-3">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Geo-Location Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductMap events={product.events} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer" className="mt-3">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4 text-accent" /> Transfer Ownership
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Transfer product ownership to another wallet address. This transaction will be recorded on the blockchain.
              </p>
              <div className="space-y-1.5">
                <Label className="text-xs">Recipient Wallet Address</Label>
                <Input
                  placeholder="0x..."
                  value={transferTo}
                  onChange={e => setTransferTo(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Recipient Role</Label>
                <Select value={transferRole} onValueChange={setTransferRole}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="Supplier">Supplier</SelectItem>
                    <SelectItem value="Retailer">Retailer</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleTransfer}
                disabled={!transferTo || !transferRole || transferring}
                className="w-full gradient-primary text-primary-foreground"
              >
                {transferring ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                )}
                {transferring ? "Signing Transfer..." : "Transfer Ownership"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
