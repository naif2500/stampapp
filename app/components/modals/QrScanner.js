'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function QrScanner({ businessId, updateStampOrRedeem, onScanSuccess }) {
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
        async (decodedText) => {
          await handleScan(decodedText);
          html5QrCode.stop();
        },
        (err) => {
          // ignore scan errors
        }
      );
    });

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  const handleScan = async (scannedToken) => {
    try {
      const tokenRef = doc(db, `businesses/${businessId}/tokens`, scannedToken);
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

      // ✅ Use your existing stamp/redeem logic
      await updateStampOrRedeem(tokenData.customerId);

      // Mark token as used
      await updateDoc(tokenRef, { used: true, usedAt: new Date() });

      onScanSuccess?.(tokenData.customerId);
    } catch (err) {
      console.error("Error handling scanned token:", err);
      alert("Failed to process QR code");
    }
  };

  return <div id="qr-reader" style={{ width: "100%" }} />;
}
