'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function QrScanner({ businessId, updateStampOrRedeem, onScanSuccess }) {
  const handleScan = useCallback(async (decodedText, html5QrCode) => {
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

      await updateStampOrRedeem(tokenData.customerId);

      await updateDoc(tokenRef, { used: true, usedAt: new Date() });

      onScanSuccess?.(tokenData.customerId);

      // ✅ stop scanner after success
      await html5QrCode.stop();
      document.getElementById("qr-reader").innerHTML = ""; // 👈 release camera view
    } catch (err) {
      console.error("Error handling scanned token:", err);
      alert("Failed to process QR code");
    }
  }, [businessId, updateStampOrRedeem, onScanSuccess]);

  useEffect(() => {
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
