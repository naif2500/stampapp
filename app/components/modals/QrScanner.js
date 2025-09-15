'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function QrScanner({ businessId, updateStampOrRedeem, onScanSuccess }) {
  const processedTokensRef = useRef(new Set()); // ✅ Track processed tokens
  const processingRef = useRef(false); // Global lock for scanning

  const safeStop = async (html5QrCode) => {
    try {
      await html5QrCode.stop();
      document.getElementById("qr-reader").innerHTML = "";
    } catch (err) {
      console.warn("QR scanner stop failed:", err);
    }
  };

  const handleScan = useCallback(async (decodedText, html5QrCode) => {
    if (processingRef.current) return; // Already handling a scan
    processingRef.current = true;      // Lock scanner immediately

    let parsed;
    try {
      parsed = JSON.parse(decodedText);
    } catch {
      alert("Invalid QR code format");
      processingRef.current = false;
      return;
    }

    const { businessId: tokenBusinessId, token } = parsed;

    if (tokenBusinessId !== businessId) {
      alert("Invalid QR code for this business");
      processingRef.current = false;
      return;
    }

    if (processedTokensRef.current.has(token)) {
      processingRef.current = false;
      return; // Already processed this token
    }
    processedTokensRef.current.add(token);

    await safeStop(html5QrCode);

    const tokenRef = doc(db, `businesses/${tokenBusinessId}/tokens`, token);

    try {
      await runTransaction(db, async (transaction) => {
        const tokenSnap = await transaction.get(tokenRef);
        if (!tokenSnap.exists() || tokenSnap.data().used) {
          throw new Error("Invalid or already used token");
        }
        transaction.update(tokenRef, { used: true, usedAt: new Date() });
      });

      const tokenSnap = await getDoc(tokenRef);
      const customerId = tokenSnap.data().customerId;

      await updateStampOrRedeem(customerId, tokenBusinessId);
      onScanSuccess?.(customerId);

    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to process QR code");
    } finally {
      // Remove token from processing set to allow new scans
      processedTokensRef.current.delete(token);
      processingRef.current = false; // Release lock
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

    return () => safeStop(html5QrCode); // cleanup safely
  }, [handleScan]);

  return <div id="qr-reader" style={{ width: "100%" }} />;
}
