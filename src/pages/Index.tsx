import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, QrCode, Map, BarChart3, ArrowRight, Factory, Truck, Store, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  { icon: ShieldCheck, title: "Blockchain Verified", desc: "Every product is registered on an immutable blockchain ledger" },
  { icon: QrCode, title: "QR Code Scanning", desc: "Instant product verification with a simple QR scan" },
  { icon: Map, title: "Geo Tracking", desc: "Track product movement across the entire supply chain" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Monitor authenticity trends and detect counterfeits" },
];

const ROLES = [
  { icon: Factory, label: "Manufacturer", desc: "Register & track products" },
  { icon: Truck, label: "Supplier", desc: "Update supply chain" },
  { icon: Store, label: "Retailer", desc: "Verify & sell products" },
  { icon: User, label: "Customer", desc: "Check authenticity" },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg">FINAL YEAR PROJECT</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/verify")}>Verify Product</Button>
            <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => navigate("/login")}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container px-4 py-16 md:py-24 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
          Designed for Ethereum Blockchain + MetaMask
        </div>
        <h1 className="font-heading text-3xl md:text-5xl font-bold max-w-7xl mx-auto leading-tight">
          FAKE PRODUCT IDENTIFICATION USING BLOCKCHAIN{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
          
          </span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Blockchain provides transparent, tamper-proof product authentication — from manufacturer to consumer.
          Every scan tells the truth.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button size="lg" className="gradient-primary text-primary-foreground" onClick={() => navigate("/verify")}>
            Verify a Product <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/login")}>
            Connect MetaMask
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container px-4 pb-16">
        <div className="grid md:grid-cols-4 gap-4">
          {FEATURES.map(f => (
            <Card key={f.title} className="shadow-card hover:shadow-elevated transition-all group">
              <CardContent className="p-5 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:gradient-primary transition-all">
                  <f.icon className="h-5 w-5 text-accent group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-heading text-sm font-semibold">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="container px-4 pb-16">
        <h2 className="font-heading text-xl font-bold text-center mb-6">Built for Every Stakeholder</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ROLES.map(r => (
            <div key={r.label} className="text-center p-4 rounded-xl bg-card border shadow-card space-y-2">
              <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center mx-auto">
                <r.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <p className="font-heading text-sm font-semibold">{r.label}</p>
              <p className="text-[11px] text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <p>created by SATHISHKUMAR, DHARANESH, RANISH, JAICHANDRAN @2026</p>
      </footer>
    </div>
  );
}
