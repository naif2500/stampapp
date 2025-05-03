'use client'
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect } from 'react';

export default function QrScanner({ onScanSuccess }) {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");

    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        html5QrCode.start(
          cameraId,
          {
            fps: 10,    // Optional frame per second
            qrbox: { width: 250, height: 250 } // Optional scanning box
          },
          (decodedText) => {
            onScanSuccess(decodedText); // Send QR result to parent
            html5QrCode.stop(); // Stop after first scan
          },
          (errorMessage) => {
            // ignore or log errors
          }
        );
      }
    });

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, [onScanSuccess]);

  return (
    <div>
      <div id="qr-reader" style={{ width: '100%' }} />
    </div>
  );
}
