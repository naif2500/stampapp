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

const safeStop = async (html5QrCode) => {
    try {
      await html5QrCode.stop();
      document.getElementById("qr-reader").innerHTML = "";
    } catch (err) {
      console.warn("QR scanner stop failed:", err);
    }
  };

  const handleScan = useCallback(async (decodedText, html5QrCode) => {
  if (processedRef.current) return;
  processedRef.current = true;

  await safeStop(html5QrCode);

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

    if (!tokenSnap.exists() || tokenSnap.data().used) {
      alert("Invalid or already used QR code");
      return;
    }

    await updateStampOrRedeem(tokenSnap.data().customerId, tokenBusinessId);
    await updateDoc(tokenRef, { used: true, usedAt: new Date() });

    onScanSuccess?.(tokenSnap.data().customerId);

  } catch (err) {
    console.error(err);
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

  return () => safeStop(html5QrCode); // ✅ cleanup safely
  }, [handleScan]);


  return <div id="qr-reader" style={{ width: "100%" }} />;
}
