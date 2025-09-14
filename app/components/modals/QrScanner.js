'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { useRef } from 'react';

export default function QrScanner({ businessId, updateStampOrRedeem, onScanSuccess }) {
  const processedRef = useRef(false);

  useEffect(() => {
  processedRef.current = false; // reset whenever scanner opens
}, [businessId]);

  const handleScan = useCallback(async (decodedText, html5QrCode) => {
    if (processedRef.current) return; // 👈 prevent double scans
    processedRef.current = true;

    try {
      let parsed;
      try {
        parsed = JSON.parse(decodedText);
      } catch {
        alert("Invalid QR code format");
        return;
      }

      const { businessId: tokenBusinessId, token } = parsed;

      if (tokenBusinessId !== businessId) {
        alert("Invalid QR code for this business");
        return;
      }

      const tokenRef = doc(db, `businesses/${tokenBusinessId}/tokens`, token);
      const tokenSnap = await getDoc(tokenRef);

      if (!tokenSnap.exists()) {
        alert("Invalid or expired QR code");
        return;
      }

      const tokenData = tokenSnap.data();
      if (tokenData.used) {
        alert("This QR code has already been used");
        return;
      }

      await updateStampOrRedeem(tokenData.customerId, tokenBusinessId);
      await updateDoc(tokenRef, { used: true, usedAt: new Date() });

      onScanSuccess?.(tokenData.customerId);

      // ✅ stop scanner after success
      await html5QrCode.stop();
      document.getElementById("qr-reader").innerHTML = ""; 
    } catch (err) {
      console.error("Error handling scanned token:", err);
      alert("Failed to process QR code");
    }
  }, [businessId, updateStampOrRedeem, onScanSuccess]);


  useEffect(() => {
  processedRef.current = false; // 👈 reset on mount
  const html5QrCode = new Html5Qrcode("qr-reader");

  Html5Qrcode.getCameras().then((devices) => {
    if (!devices || devices.length === 0) return;

    const backCamera = devices.find((d) =>
      d.label.toLowerCase().includes("back") ||
      d.label.toLowerCase().includes("environment")
    );
    const cameraId = backCamera ? backCamera.id : devices[0].id;

    html5QrCode.start(
      cameraId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => handleScan(decodedText, html5QrCode),
      () => {}
    );
  });

  return () => {
    html5QrCode.stop().catch(() => {});
  };
}, [handleScan]);


  return <div id="qr-reader" style={{ width: "100%" }} />;
}
