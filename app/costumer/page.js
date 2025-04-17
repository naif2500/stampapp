'use client';
import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CUSTOMER_ID = 'test-customer-id'; // Replace this dynamically later

export default function CustomerPage() {
  const [stamps, setStamps] = useState(0);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    async function fetchData() {
      const userRef = doc(db, 'users', CUSTOMER_ID);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setStamps(userSnap.data().stamps || 0);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className='p-6 bg-white rounded-lg shadow-lg flex flex-col items-center justify-center relative w-[300px] text-center'>
      <h1 className="text-md font-bold mb-4">You have {stamps}/9 stamps</h1>
      <div className="grid grid-cols-5 gap-2">
  {Array.from({ length: 10 }).map((_, i) => (
    <div
      key={i}
      className={`w-6 h-6 rounded-full border-2 ${
        i < stamps ? 'bg-[#6774CA] border-[#6774CA]' : 'bg-white border-gray-300'
      }`}
    />
  ))}
</div>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 text-[#6774CA] cursor-pointer"
      >
      + Tilføj stemple
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-[#6774CA] bg-opacity-50 flex justify-center items-center z-50">
           <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 left-2 text-white hover:text-black text-xl"
            >
              ×
            </button>
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center relative w-[300px] text-center">
          <img
    src="https://placehold.co/84x84"
    className="w-20 h-20 rounded-full absolute -top-10 left-1/2 transform -translate-x-1/2  border-2 border-white"
  />
            <h2 className="text-lg font-semibold mt-6 mb-2">Your QR Code</h2>
            <p className="mb-6 text-xs">Scan this QR code to get your stamps!</p>
            <QRCodeCanvas value={CUSTOMER_ID} size={180} />
          </div>
        </div>
      )}  </div>  </div>
  );
}
