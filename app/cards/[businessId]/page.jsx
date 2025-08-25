'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/lib/firebase';
import LoyaltyCard from '../../components/cards/LoyaltyCard';
import QrModal from '../../components/modals/QrModal';

export default function CardDetailPage() {
  const { businessId } = useParams();
  const [cardData, setCardData] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }

      setCustomerId(user.uid);

      // Fetch user's joined businesses
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const joined = userSnap.data().joinedBusinesses || {};
        if (joined[businessId]) {
          setCardData(joined[businessId]);
        } else {
          alert('You have not joined this business card yet.');
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [businessId]);

  if (loading) return <p>Loading...</p>;
  if (!cardData) return <p>Card not found.</p>;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      {/* Display the Loyalty Card */}
      <LoyaltyCard {...cardData} />

      {/* Card details */}
      <div className="mt-6 w-full max-w-md bg-white shadow-md rounded-xl p-4">
        <h2 className="text-xl font-bold mb-2">{cardData.name}</h2>
        <p className="text-gray-700 mb-2">{cardData.cardName}</p>
        <p className="text-gray-600">
          Stamps: {cardData.stamps} / {cardData.stampsNeeded}
        </p>
        {cardData.type === 'stamp' && (
          <p className="text-sm text-gray-500 mt-2">Scan your QR to add stamps.</p>
        )}
      </div>

      {/* Show QR button */}
      {cardData.type === 'stamp' && customerId && (
        <button
          onClick={() => setShowQr(true)}
          className="mt-6 px-6 py-3 bg-[#6774CA] text-white rounded-xl font-semibold shadow-md"
        >
          Show QR Code
        </button>
      )}

      {/* QR Modal */}
      {showQr && (
        <QrModal
          customerId={customerId}
          onClose={() => setShowQr(false)}
          logoUrl={cardData.logoUrl}
          cardName={cardData.cardName}
        />
      )}
    </div>
  );
}
