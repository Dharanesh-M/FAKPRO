import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff } from "lucide-react";

interface QrScannerProps {
  onScan: (decodedText: string) => void;
  width?: number;
  height?: number;
}

export function QrScanner({ onScan, width = 300, height = 300 }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-reader";

  const startScanning = async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        () => {} // ignore errors during scanning
      );
      setIsScanning(true);
    } catch (err: any) {
      setError(
        err?.message?.includes("NotAllowedError")
          ? "Camera permission denied. Please allow camera access."
          : "Unable to start camera. Ensure camera is available."
      );
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="space-y-3">
      <div
        id={containerId}
        style={{ width, height }}
        className="mx-auto rounded-xl overflow-hidden bg-muted border-2 border-dashed border-border"
      />

      {error && (
        <p className="text-xs text-destructive text-center">{error}</p>
      )}

      <div className="flex justify-center">
        {!isScanning ? (
          <Button onClick={startScanning} variant="outline" size="sm" className="gap-2">
            <Camera className="h-4 w-4" />
            Start Camera Scanner
          </Button>
        ) : (
          <Button onClick={stopScanning} variant="outline" size="sm" className="gap-2">
            <CameraOff className="h-4 w-4" />
            Stop Scanner
          </Button>
        )}
      </div>
    </div>
  );
}
