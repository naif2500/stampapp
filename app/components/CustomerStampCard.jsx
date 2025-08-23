// components/CustomerStampCard.jsx
'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import StampConfirmationModal from './modals/StampConfirmationModal';

export default function CustomerStampCard({ businessId, customerId, stampsNeeded = 10 }) {
  const [stampCount, setStampCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!businessId || !customerId) return;

    const customerRef = doc(db, `businesses/${businessId}/customers`, customerId);

    // 🔥 Listen for changes in stamp count
    const unsubscribe = onSnapshot(customerRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        // Detect stamp increase
        if (data.stampCount > stampCount) {
          setShowModal(true); // open modal
        }

        setStampCount(data.stampCount);
      }
    });

    return () => unsubscribe();
  }, [businessId, customerId, stampCount]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-2">Your Stamps</h2>
      <p>{stampCount} / {stampsNeeded}</p>

      {showModal && (
        <StampConfirmationModal
          newStampCount={stampCount}
          stampsNeeded={stampsNeeded}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
