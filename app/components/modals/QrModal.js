'use client';
import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export default function QrModal({ customerId, onClose, logoUrl, cardName }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const createToken = async () => {
      const oneTimeToken = uuidv4(); // Generate unique token
      setToken(oneTimeToken);

      // Save token in Firestore under this customer, with timestamp
      const tokenRef = doc(db, `tokens/${oneTimeToken}`);
      await setDoc(tokenRef, {
        customerId,
        createdAt: new Date(),
        used: false,
      });
    };

    createToken();
  }, [customerId]);

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
          src={logoUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full absolute -top-10 left-1/2 transform -translate-x-1/2 border-1 border-white bg-white"
        />
        <h2 className="text-lg font-semibold mt-6 mb-2">{cardName}</h2>
        <p className="mb-6 text-xs">Scan this QR code to get your stamps!</p>
        {token && <QRCodeCanvas value={token} size={180} />}
      </div>
    </div>
  );
}
