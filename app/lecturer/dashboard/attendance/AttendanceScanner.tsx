"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useCameraPermission } from "@/hooks/cameraPermission";

type Props = {
  active: boolean;
  onScan: (decodedText: string) => void;
  onError: (message: string) => void;
};

export function AttendanceScanner({ active, onScan, onError }: Props) {
  const qrReaderRef = useRef<any>(null);
  const isScanningRef = useRef(false);
  const lastScanRef = useRef<number>(0);

  const { status, requestPermission } = useCameraPermission();

  const safeStopScanner = async () => {
    try {
      const scanner = qrReaderRef.current;

      if (!scanner || !isScanningRef.current) return;

      isScanningRef.current = false;

      await scanner.stop();
      await scanner.clear();

      qrReaderRef.current = null;
    } catch (err) {
      console.warn("Scanner stop ignored:", err);
    }
  };

  useEffect(() => {
    if (!active) {
      safeStopScanner();
      return;
    }

    let mounted = true;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");

        const html5Qrcode = new Html5Qrcode("lecturer-attendance-scanner");
        qrReaderRef.current = html5Qrcode;

        // Start scanning using back camera (facingMode: environment)
        await html5Qrcode.start(
          { facingMode: { exact: "environment" } }, // back camera
          {
            fps: 8,
            qrbox: { width: 300, height: 300 },
            disableFlip: false,
          },
          (decodedText: string) => {
            const now = Date.now();

            // Prevent duplicate scans within 2 seconds
            if (now - lastScanRef.current < 2000) return;
            lastScanRef.current = now;

            try {
              onScan(decodedText);
            } catch (err) {
              console.error("Scan handler error:", err);
            }
          },
          (errorMessage) => {
            // optional: ignore scan errors
          },
        );

        isScanningRef.current = true;
      } catch (error) {
        console.error("Camera start error:", error);
        onError(
          error instanceof Error
            ? error.message
            : "Unable to activate device camera.",
        );
      }
    };

    if (status === "granted") {
      startScanner();
    } else if (status === "denied") {
      onError("Camera permission denied");
    }

    return () => {
      mounted = false;
      safeStopScanner();
    };
  }, [active, onScan, onError]);

  return (
    <Card className="bg-slate-950/80 border-white/10 shadow-inner">
      <CardContent className="p-3">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/70">
          {/* ✅ FIXED: container ONLY id (no ref) */}
          <div
            id="lecturer-attendance-scanner"
            className="h-96 min-h-[20rem] w-full bg-black"
          />

          {!active && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 text-center p-6">
              <div>
                <p className="text-lg font-semibold text-white">
                  Scanner paused
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Start a session to enable the camera and scan QR codes.
                </p>
                <button
                  onClick={requestPermission}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Allow Camera Access
                </button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
