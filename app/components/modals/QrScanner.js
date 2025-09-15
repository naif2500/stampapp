'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function QrScanner({ businessId, updateStampOrRedeem, onScanSuccess }) {
  const processedRef = useRef(false); // blocks double processing
  const cooldownRef = useRef(false);  // short cooldown between scans

  const safeStop = async (html5QrCode) => {
    try {
      await html5QrCode.stop();
      document.getElementById("qr-reader").innerHTML = "";
    } catch (err) {
      console.warn("QR scanner stop failed:", err);
    }
  };

  const handleScan = useCallback(async (decodedText, html5QrCode) => {
    if (processedRef.current || cooldownRef.current) return; // block double scan or cooldown
    processedRef.current = true;
    cooldownRef.current = true;

    // start cooldown timer (1.5 seconds)
    setTimeout(() => {
      cooldownRef.current = false;
    }, 1500);

    try {
      let parsed;
      try { parsed = JSON.parse(decodedText); }
      catch { alert("Invalid QR code format"); return; }

      const { businessId: tokenBusinessId, token } = parsed;

      if (tokenBusinessId !== businessId) {
        alert("Invalid QR code for this business");
        return;
      }

      const tokenRef = doc(db, `businesses/${tokenBusinessId}/tokens`, token);
      const tokenSnap = await getDoc(tokenRef);

      if (!tokenSnap.exists()) {
        alert("Invalid QR code");
        return;
      }

      const tokenData = tokenSnap.data();
      if (tokenData.used) {
        alert("This QR code has already been used");
        return;
      }

      // mark token as used
      await updateDoc(tokenRef, { used: true, usedAt: new Date() });

      // update stamp/redeem
      await updateStampOrRedeem(tokenData.customerId, tokenBusinessId);

      // callback for parent
      onScanSuccess?.(tokenData.customerId);

      // stop scanner after successful scan
      await safeStop(html5QrCode);

    } catch (err) {
      console.error("Failed to process QR code", err);
      alert("Failed to process QR code");
    } finally {
      processedRef.current = false; // reset processed flag for next scan
    }
  }, [businessId, updateStampOrRedeem, onScanSuccess]);

  useEffect(() => {
    processedRef.current = false; // reset whenever scanner opens

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

    return () => safeStop(html5QrCode);
  }, [handleScan]);

  return <div id="qr-reader" style={{ width: "100%" }} />;
}
