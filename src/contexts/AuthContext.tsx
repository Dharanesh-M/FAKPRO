import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { blockchainService, MetaMaskState } from "@/services/blockchain";
import { toast } from "sonner";

export type UserRole = "manufacturer" | "supplier" | "retailer" | "customer" | "admin";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  walletAddress: string;
  walletConnected: boolean;
  chainId: string | null;
  balance: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isConnecting: boolean;
  hasMetaMask: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const hasMetaMask = blockchainService.hasMetaMask;

  const login = useCallback(async (role: UserRole) => {
    setIsConnecting(true);
    try {
      const wallet: MetaMaskState = await blockchainService.connectWallet();
      if (!wallet.address) throw new Error("No account returned");

      const shortAddr = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`;
      setUser({
        id: wallet.address,
        name: shortAddr,
        role,
        walletAddress: wallet.address,
        walletConnected: true,
        chainId: wallet.chainId,
        balance: wallet.balance,
      });

      toast.success(`Connected as ${role} — ${shortAddr}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to connect MetaMask");
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    toast.info("Wallet disconnected");
  }, []);

  // Listen for account/chain changes
  useEffect(() => {
    blockchainService.onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        setUser(null);
      } else if (user) {
        const addr = accounts[0];
        setUser(prev => prev ? {
          ...prev,
          walletAddress: addr,
          id: addr,
          name: `${addr.slice(0, 6)}...${addr.slice(-4)}`,
        } : null);
      }
    });

    blockchainService.onChainChanged((chainId) => {
      setUser(prev => prev ? { ...prev, chainId } : null);
    });
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isConnecting, hasMetaMask }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
