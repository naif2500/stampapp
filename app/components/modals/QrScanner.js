'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState, useCallback } from 'react';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { X } from 'lucide-react';

export default function QrScanner({ businessId, updateStampOrRedeem, onScanSuccess }) {
  const html5QrCodeRef = useRef(null);
  const [scannedData, setScannedData] = useState(null); // Data from QR code
  const [modalOpen, setModalOpen] = useState(false);

  // Start scanner
  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras().then((devices) => {
      if (!devices || devices.length === 0) return;

      const backCamera = devices.find((d) =>
        d.label.toLowerCase().includes("back") ||
        d.label.toLowerCase().includes("environment")
      );
      const cameraId = backCamera ? backCamera.id : devices[0].id;

      html5QrCodeRef.current.start(
        cameraId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleScan,
        () => {}
      );
    });

    return () => html5QrCodeRef.current?.stop();
  }, []);

  // Handle scan: just parse and open modal
  const handleScan = useCallback((decodedText) => {
    let parsed;
    try {
      parsed = JSON.parse(decodedText);
    } catch {
      alert("Invalid QR code format");
      return;
    }

    const { businessId: tokenBusinessId, token } = parsed;
    if (tokenBusinessId !== businessId) {
      alert("QR code is for a different business");
      return;
    }

    // Pause scanning while modal is open
    html5QrCodeRef.current.pause(true);
    setScannedData({ token, tokenBusinessId });
    setModalOpen(true);
  }, [businessId]);

  // Confirm stamp
  const confirmStamp = async () => {
    const { token, tokenBusinessId } = scannedData;
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

      alert("Stamp applied successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to process QR code");
    } finally {
      // Close modal and resume scanning
      setModalOpen(false);
      setScannedData(null);
      html5QrCodeRef.current.resume();
    }
  };

  // Cancel modal
  const cancelScan = () => {
    setModalOpen(false);
    setScannedData(null);
    html5QrCodeRef.current.resume();
  };

  return (
      <>
      <div id="qr-reader" style={{ width: "100%" }} />

      {modalOpen && (
        <div className="fixed inset-0 bg-[#6774CA] z-50 flex flex-col">
          {/* Cancel "X" */}
          <button
            onClick={cancelScan}
            className="absolute top-4 right-4 text-white"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title */}
          <h2 className="text-center text-white font-bold text-xl mt-12">
            Scan Qr koden
          </h2>

          {/* Scanner Area */}
          <div className="flex-1 flex items-center justify-center">
            <div id="qr-reader" className="w-72 h-72 bg-white rounded-lg" />
          </div>
        </div>
      )}
    </>
  );
}
