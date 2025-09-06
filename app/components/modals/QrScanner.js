// components/QrScanner.jsx
'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StampConfirmationModal from './StampConfirmationModal';

export default function QrScanner({ updateStampOrRedeem, onScanSuccess }) {
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
        (err) => {}
      );
    });

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  const handleScan = async (token) => {
    try {
      const tokenRef = doc(db, "tokens", token);
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

      // ✅ Call your existing function to update stamps
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

