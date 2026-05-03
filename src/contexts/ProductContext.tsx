import React, { createContext, useContext, useState, useCallback } from "react";
import { genTxHash } from "@/services/blockchain";

export interface ProductEvent {
  id: string;
  role: string;
  action: string;
  timestamp: string;
  location: { lat: number; lng: number; name: string };
  txHash: string;
  status: "confirmed" | "pending";
}

export interface OwnershipRecord {
  id: string;
  from: string;
  fromRole: string;
  to: string;
  toRole: string;
  timestamp: string;
  txHash: string;
  status: "confirmed" | "pending";
}

export interface Product {
  id: string;
  name: string;
  batch: string;
  origin: string;
  manufacturerDate: string;
  description: string;
  imageUrl: string;
  manufacturer: string;
  qrCode: string;
  isAuthentic: boolean;
  events: ProductEvent[];
  ownership: OwnershipRecord[];
  currentOwner: string;
  currentOwnerRole: string;
  scanCount: number;
  lastScanLocation?: { lat: number; lng: number };
  suspicious: boolean;
}

interface ProductContextType {
  products: Product[];
  addProduct: (p: Omit<Product, "id" | "qrCode" | "events" | "ownership" | "currentOwner" | "currentOwnerRole" | "scanCount" | "suspicious" | "isAuthentic">) => Product;
  getProduct: (id: string) => Product | undefined;
  addEvent: (productId: string, event: Omit<ProductEvent, "id" | "txHash" | "status">) => void;
  transferOwnership: (productId: string, toAddress: string, toRole: string) => void;
  verifyProduct: (id: string) => Product | undefined;
  stats: { total: number; authentic: number; fake: number; suspicious: number; transactions: number };
}

const ProductContext = createContext<ProductContextType | null>(null);

const genId = () => "PRD-" + Math.random().toString(36).substr(2, 8).toUpperCase();

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "PRD-DEMO001",
    name: "Premium Wireless Headphones",
    batch: "BATCH-2026-A1",
    origin: "Shenzhen, China",
    manufacturerDate: "2026-01-15",
    description: "High-fidelity wireless headphones with ANC",
    imageUrl: "",
    manufacturer: "TechCorp Manufacturing",
    qrCode: "PRD-DEMO001",
    isAuthentic: true,
    scanCount: 3,
    suspicious: false,
    currentOwner: "0xRetailer...ghi",
    currentOwnerRole: "Retailer",
    ownership: [
      { id: "o1", from: "0x0000", fromRole: "System", to: "0xManufacturer...abc", toRole: "Manufacturer", timestamp: "2026-01-15T09:00:00Z", txHash: genTxHash(), status: "confirmed" },
      { id: "o2", from: "0xManufacturer...abc", fromRole: "Manufacturer", to: "0xSupplier...def", toRole: "Supplier", timestamp: "2026-02-01T14:30:00Z", txHash: genTxHash(), status: "confirmed" },
      { id: "o3", from: "0xSupplier...def", fromRole: "Supplier", to: "0xRetailer...ghi", toRole: "Retailer", timestamp: "2026-03-10T10:00:00Z", txHash: genTxHash(), status: "confirmed" },
    ],
    events: [
      { id: "e1", role: "Manufacturer", action: "Product Created", timestamp: "2026-01-15T09:00:00Z", location: { lat: 22.5431, lng: 114.0579, name: "Shenzhen, China" }, txHash: genTxHash(), status: "confirmed" },
      { id: "e2", role: "Supplier", action: "Received & Inspected", timestamp: "2026-02-01T14:30:00Z", location: { lat: 1.3521, lng: 103.8198, name: "Singapore" }, txHash: genTxHash(), status: "confirmed" },
      { id: "e3", role: "Retailer", action: "In Store - Available", timestamp: "2026-03-10T10:00:00Z", location: { lat: 12.9716, lng: 77.5946, name: "Bangalore, India" }, txHash: genTxHash(), status: "confirmed" },
    ],
  },
  {
    id: "PRD-DEMO002",
    name: "Organic Green Tea - 100g",
    batch: "BATCH-2026-T5",
    origin: "Darjeeling, India",
    manufacturerDate: "2026-02-20",
    description: "Premium organic green tea leaves",
    imageUrl: "",
    manufacturer: "Darjeeling Tea Estates",
    qrCode: "PRD-DEMO002",
    isAuthentic: true,
    scanCount: 1,
    suspicious: false,
    currentOwner: "0xSupplier...jkl",
    currentOwnerRole: "Supplier",
    ownership: [
      { id: "o4", from: "0x0000", fromRole: "System", to: "0xManufacturer...mno", toRole: "Manufacturer", timestamp: "2026-02-20T08:00:00Z", txHash: genTxHash(), status: "confirmed" },
      { id: "o5", from: "0xManufacturer...mno", fromRole: "Manufacturer", to: "0xSupplier...jkl", toRole: "Supplier", timestamp: "2026-03-05T12:00:00Z", txHash: genTxHash(), status: "confirmed" },
    ],
    events: [
      { id: "e4", role: "Manufacturer", action: "Product Created", timestamp: "2026-02-20T08:00:00Z", location: { lat: 27.0410, lng: 88.2627, name: "Darjeeling, India" }, txHash: genTxHash(), status: "confirmed" },
      { id: "e5", role: "Supplier", action: "Shipped to Distributor", timestamp: "2026-03-05T12:00:00Z", location: { lat: 19.0760, lng: 72.8777, name: "Mumbai, India" }, txHash: genTxHash(), status: "confirmed" },
    ],
  },
  {
    id: "PRD-FAKE001",
    name: "Counterfeit Luxury Watch",
    batch: "BATCH-FAKE-X1",
    origin: "Unknown",
    manufacturerDate: "2026-01-01",
    description: "Suspicious product - unverified origin",
    imageUrl: "",
    manufacturer: "Unknown",
    qrCode: "PRD-FAKE001",
    isAuthentic: false,
    scanCount: 12,
    suspicious: true,
    currentOwner: "Unknown",
    currentOwnerRole: "Unknown",
    ownership: [],
    events: [
      { id: "e6", role: "Unknown", action: "First Scan Detected", timestamp: "2026-03-15T22:00:00Z", location: { lat: 28.6139, lng: 77.2090, name: "Delhi, India" }, txHash: genTxHash(), status: "confirmed" },
    ],
  },
];

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);

  const addProduct = useCallback((p: Omit<Product, "id" | "qrCode" | "events" | "ownership" | "currentOwner" | "currentOwnerRole" | "scanCount" | "suspicious" | "isAuthentic">) => {
    const id = genId();
    const txHash = genTxHash();
    const newProduct: Product = {
      ...p,
      id,
      qrCode: id,
      isAuthentic: true,
      scanCount: 0,
      suspicious: false,
      currentOwner: "creator",
      currentOwnerRole: "Manufacturer",
      ownership: [{
        id: "o-" + Date.now(),
        from: "0x0000",
        fromRole: "System",
        to: "creator",
        toRole: "Manufacturer",
        timestamp: new Date().toISOString(),
        txHash,
        status: "confirmed",
      }],
      events: [{
        id: "e-" + Date.now(),
        role: "Manufacturer",
        action: "Product Created",
        timestamp: new Date().toISOString(),
        location: { lat: 12.9716, lng: 77.5946, name: p.origin },
        txHash,
        status: "confirmed",
      }],
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const getProduct = useCallback((id: string) => products.find(p => p.id === id), [products]);

  const addEvent = useCallback((productId: string, event: Omit<ProductEvent, "id" | "txHash" | "status">) => {
    setProducts(prev => prev.map(p => p.id === productId ? {
      ...p,
      events: [...p.events, { ...event, id: "e-" + Date.now(), txHash: genTxHash(), status: "pending" as const }],
    } : p));
    setTimeout(() => {
      setProducts(prev => prev.map(p => p.id === productId ? {
        ...p,
        events: p.events.map(e => e.status === "pending" ? { ...e, status: "confirmed" as const } : e),
      } : p));
    }, 2000);
  }, []);

  const transferOwnership = useCallback((productId: string, toAddress: string, toRole: string) => {
    const txHash = genTxHash();
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const record: OwnershipRecord = {
        id: "o-" + Date.now(),
        from: p.currentOwner,
        fromRole: p.currentOwnerRole,
        to: toAddress,
        toRole,
        timestamp: new Date().toISOString(),
        txHash,
        status: "pending",
      };
      return {
        ...p,
        currentOwner: toAddress,
        currentOwnerRole: toRole,
        ownership: [...p.ownership, record],
      };
    }));
    // Simulate confirmation
    setTimeout(() => {
      setProducts(prev => prev.map(p => p.id === productId ? {
        ...p,
        ownership: p.ownership.map(o => o.status === "pending" ? { ...o, status: "confirmed" as const } : o),
      } : p));
    }, 2000);
  }, []);

  const verifyProduct = useCallback((id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, scanCount: p.scanCount + 1 } : p));
    }
    return product;
  }, [products]);

  const stats = {
    total: products.length,
    authentic: products.filter(p => p.isAuthentic).length,
    fake: products.filter(p => !p.isAuthentic).length,
    suspicious: products.filter(p => p.suspicious).length,
    transactions: products.reduce((sum, p) => sum + p.events.length, 0),
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, getProduct, addEvent, transferOwnership, verifyProduct, stats }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
