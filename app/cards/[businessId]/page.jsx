'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/lib/firebase';
import LoyaltyCard from '../../components/cards/LoyaltyCard';
import QrModal from '../../components/modals/QrModal';
import FixedNavbar from '../../components/FixedNavbar';

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
        
      <FixedNavbar title="Card detail" />
        
      {/* Display the Loyalty Card */}
       <div className="mt-20 w-full max-w-md px-4">
    <LoyaltyCard {...cardData} />
  </div>

  {/* Logs Container */}
  <div className="mt-6 w-full max-w-md bg-white shadow-md rounded-xl p-4">
    <h2 className="text-lg font-semibold mb-4">Logs</h2>
    <div className="grid grid-cols-2 gap-y-3 text-sm">
      {/* Example log rows */}
      <div className="text-gray-600">2025-08-25</div>
      <div className="text-gray-800">You received a stamp</div>

      <div className="text-gray-600">2025-08-20</div>
      <div className="text-gray-800">You redeemed</div>

      <div className="text-gray-600">2025-08-15</div>
      <div className="text-gray-800">You received a stamp</div>
    </div>
  </div>

  {/* Fixed Bottom Button */}
  {cardData.type === 'stamp' && customerId && (
    <div className="fixed bottom-6 w-full px-6">
      <button
        onClick={() => setShowQr(true)}
        className="w-full py-3 bg-[#6774CA] text-white rounded-xl font-semibold shadow-md"
      >
        Show QR Code
      </button>
    </div>
  )}

  {/* QR Modal */}
  {showQr && (
    <QrModal
      businessId={businessId}
      customerId={customerId}
      onClose={() => setShowQr(false)}
      logoUrl={cardData.logoUrl}
      cardName={cardData.cardName}
    />
  )}
</div>
  );
}
