import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Factory, Truck, Store, User, ShieldCheck, Wallet, Loader2, AlertCircle } from "lucide-react";

const ROLES: { role: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { role: "manufacturer", label: "Manufacturer", icon: Factory, desc: "Create & register products" },
  { role: "supplier", label: "Supplier", icon: Truck, desc: "Track supply chain" },
  { role: "retailer", label: "Retailer", icon: Store, desc: "Retail & sell products" },
  { role: "customer", label: "Customer", icon: User, desc: "Verify authenticity" },
  { role: "admin", label: "Admin", icon: ShieldCheck, desc: "Monitor & analytics" },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>("manufacturer");
  const { login, isConnecting, hasMetaMask } = useAuth();
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      await login(selectedRole);
      navigate(selectedRole === "customer" ? "/verify" : "/dashboard");
    } catch {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto shadow-elevated">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold">FAKE PRODUCT IDENTIFICATION</h1>
          <p className="text-sm text-muted-foreground">Blockchain-Powered Product Authentication</p>
        </div>

        <Card className="shadow-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Connect Wallet</CardTitle>
            <CardDescription>Select your role and connect MetaMask to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Role selector */}
            <div className="grid grid-cols-5 gap-1.5">
              {ROLES.map(({ role, label, icon: Icon }) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-all ${
                    selectedRole === role
                      ? "gradient-primary text-primary-foreground shadow-card"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate w-full text-center">{label}</span>
                </button>
              ))}
            </div>

            {/* Role description */}
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">
                {ROLES.find(r => r.role === selectedRole)?.desc}
              </p>
            </div>

            {!hasMetaMask ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <div className="text-xs text-destructive">
                    <p className="font-medium">MetaMask Not Detected</p>
                    <p className="mt-1">Install the MetaMask browser extension to continue.</p>
                  </div>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => window.open("https://metamask.io/download/", "_blank")}
                >
                  Install MetaMask
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full gradient-primary text-primary-foreground gap-2"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                {isConnecting ? "Connecting..." : `Connect MetaMask as ${ROLES.find(r => r.role === selectedRole)?.label}`}
              </Button>
            )}

            <p className="text-[10px] text-center text-muted-foreground">
              Authentication is handled entirely through MetaMask — no passwords needed
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="link" className="text-xs text-muted-foreground" onClick={() => navigate("/verify")}>
            Just want to verify a product? →
          </Button>
        </div>
      </div>
    </div>
  );
}
