// components/QrModal.jsx
'use client';
import { QRCodeCanvas } from 'qrcode.react';

export default function QrModal({ customerId, onClose }) {
  return (
    <div className="fixed inset-0 bg-[#6774CA] bg-opacity-50 flex justify-center items-center z-50">
      <button
        onClick={onClose}
        className="absolute top-2 left-2 text-white hover:text-black text-xl"
      >
        ×
      </button>

      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center relative w-[300px] text-center">
        <img
          src="https://placehold.co/84x84"
          alt="Profile"
          className="w-20 h-20 rounded-full absolute -top-10 left-1/2 transform -translate-x-1/2 border-2 border-white"
        />
        <h2 className="text-lg font-semibold mt-6 mb-2">Your QR Code</h2>
        <p className="mb-6 text-xs">Scan this QR code to get your stamps!</p>
        <QRCodeCanvas value={customerId} size={180} />
      </div>
    </div>
  );
}
