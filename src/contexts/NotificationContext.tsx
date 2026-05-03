import React, { createContext, useContext, useState, useCallback } from "react";

export type NotificationType = "transfer" | "scan" | "counterfeit" | "suspicious" | "system" | "update";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  productId?: string;
  timestamp: string;
  read: boolean;
  from?: string;
  to?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1", type: "counterfeit", title: "Counterfeit Detected",
    message: "Product PRD-FAKE001 (Counterfeit Luxury Watch) has been flagged as fake. Scanned 12 times from suspicious locations.",
    productId: "PRD-FAKE001", timestamp: "2026-03-15T22:05:00Z", read: false,
  },
  {
    id: "n2", type: "suspicious", title: "Suspicious Scan Activity",
    message: "Product PRD-DEMO001 scanned from 3 different countries within 2 hours. Possible QR code duplication.",
    productId: "PRD-DEMO001", timestamp: "2026-03-14T18:00:00Z", read: false,
  },
  {
    id: "n3", type: "transfer", title: "Ownership Transferred",
    message: "PRD-DEMO001 ownership transferred from TechCorp Manufacturing → Global Supply Co.",
    productId: "PRD-DEMO001", timestamp: "2026-02-01T14:30:00Z", read: true,
    from: "0xManufacturer...abc", to: "0xSupplier...def",
  },
  {
    id: "n4", type: "transfer", title: "Ownership Transferred",
    message: "PRD-DEMO001 ownership transferred from Global Supply Co. → RetailMax Store.",
    productId: "PRD-DEMO001", timestamp: "2026-03-10T10:00:00Z", read: true,
    from: "0xSupplier...def", to: "0xRetailer...ghi",
  },
  {
    id: "n5", type: "update", title: "Product Status Updated",
    message: "PRD-DEMO002 status updated: Shipped to Distributor by supplier.",
    productId: "PRD-DEMO002", timestamp: "2026-03-05T12:00:00Z", read: true,
  },
  {
    id: "n6", type: "system", title: "Smart Contract Deployed",
    message: "ProductAuthentication v2.1 deployed to Sepolia testnet successfully.",
    timestamp: "2026-03-01T09:00:00Z", read: true,
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const addNotification = useCallback((n: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotif: Notification = {
      ...n,
      id: "n-" + Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};
