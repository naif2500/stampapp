'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getFunctions, httpsCallable } from "firebase/functions";
import { X } from 'lucide-react';

export default function QrScanner({ businessId, onScanSuccess, onClose }) {
  const html5QrCodeRef = useRef(null);
  const [scannedData, setScannedData] = useState(null); 
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

  return () => {
    (async () => {
      try {
        if (html5QrCodeRef.current) {
          await html5QrCodeRef.current.stop();
          html5QrCodeRef.current.clear();
        }
      } catch (err) {
        console.warn("QR cleanup error:", err);
      }
    })();
  };
}, []);

  // Handle scan
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

    try {
    const { token, tokenBusinessId } = scannedData;
   const functions = getFunctions(undefined, "europe-north1");
const fn = httpsCallable(functions, "consumeToken");

const result = await fn({ businessId: tokenBusinessId, token });


// 3 Notify success
onScanSuccess?.(result.data.customerId);
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
  onClick={async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear(); 
      }
    } catch (err) {
      console.warn("QR stop error:", err);
    } finally {
      setModalOpen(false);
      setScannedData(null);
      onClose?.();
    }
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
