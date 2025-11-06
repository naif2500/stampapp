'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState, useCallback } from 'react';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from '@/lib/firebase';
import { X } from 'lucide-react';

export default function QrScanner({ businessId, updateStampOrRedeem, onScanSuccess, onClose }) {
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

  

// 2 Call your Cloud Function securely
const functions = getFunctions(undefined, "europe-north1"); // match your region
const updateStampOrRedeemFn = httpsCallable(functions, "updateStampOrRedeem");

try {
  const result = await updateStampOrRedeemFn({
    userId: customerId,
    businessId: tokenBusinessId,
  });
  console.log(" Cloud Function result:", result.data);
} catch (fnError) {
  console.error(" Cloud Function error:", fnError);
}

// 3 Notify success
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
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      {/* Close button */}
      <button
        onClick={() => {
          html5QrCodeRef.current?.stop().catch(() => {});
          setModalOpen(false);
          setScannedData(null);
          onClose?.();
        }}
        className="absolute top-5 left-5 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 z-[999]"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Title */}
      <h2 className="text-center text-white font-bold text-xl mb-6">Scan QR Code</h2>

      {/* QR Scanner */}
      <div id="qr-reader" className="w-72 h-72 rounded-2xl overflow-hidden shadow-lg"></div>

      {/* Confirm Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl w-80 text-center shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Stamp</h2>
            <p className="mb-6">
              Apply stamp for token: <strong>{scannedData?.token}</strong>?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmStamp}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirm
              </button>
              <button
                onClick={cancelScan}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
