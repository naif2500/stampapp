// components/QrScanner.jsx
'use client';

import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StampConfirmationModal from './StampConfirmationModal';

export default function QrScanner({ businessId }) {
  const [scannedCustomer, setScannedCustomer] = useState(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        html5QrCode.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            await handleScan(decodedText);
            html5QrCode.stop();
          },
          (errorMessage) => {
            // ignore errors
          }
        );
      }
    });

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  const handleScan = async (customerId) => {
    if (!businessId || !customerId) return;

    const customerRef = doc(db, `businesses/${businessId}/customers`, customerId);

    try {
      const snap = await getDoc(customerRef);

      if (snap.exists()) {
        await updateDoc(customerRef, { stampCount: increment(1) });
        const data = snap.data();
        setScannedCustomer(data.name || "Customer");
      } else {
        await setDoc(customerRef, {
          customerId,
          stampCount: 1,
          createdAt: new Date(),
        });
        setScannedCustomer("New Customer");
      }
    } catch (err) {
      console.error("Error updating stamp:", err);
    }
  };

  return (
    <div>
      <div id="qr-reader" style={{ width: '100%' }} />
      {scannedCustomer && (
        <StampConfirmationModal
          customerName={scannedCustomer}
          onClose={() => setScannedCustomer(null)}
        />
      )}
    </div>
  );
}
