"use client";

import { useEffect, useState } from "react";

export function useCameraPermission() {
  const [status, setStatus] = useState<
    "loading" | "granted" | "denied" | "prompt"
  >("loading");

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      // stop stream immediately after permission
      stream.getTracks().forEach((track) => track.stop());

      setStatus("granted");
    } catch (err: any) {
      console.error("Camera permission error:", err);

      if (err.name === "NotAllowedError") {
        setStatus("denied");
      } else {
        setStatus("denied");
      }
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      try {
        // Check if permission API exists
        const result = await navigator.permissions?.query({
          name: "camera" as PermissionName,
        });

        if (result?.state === "granted") {
          setStatus("granted");
        } else if (result?.state === "denied") {
          setStatus("denied");
        } else {
          setStatus("prompt");
        }
      } catch {
        setStatus("prompt");
      }
    };

    checkPermission();
  }, []);

  return { status, requestPermission };
}
