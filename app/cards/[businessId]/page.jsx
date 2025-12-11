'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/lib/firebase';
import LoyaltyCard from '../../components/cards/LoyaltyCard';
import QrModal from '../../components/modals/QrModal';
import FixedNavbar from '../../components/FixedNavbar';

export default function CardDetailPage() {
  const { businessId } = useParams();
  const [cardData, setCardData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    let unsubscribeUser = null;
    let unsubscribeLogs = null;

    const init = () => {
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          window.location.href = '/login';
          return;
        }

        setCustomerId(user.uid);

        const userRef = doc(db, 'users', user.uid);
        // Real-time listener for card data
        unsubscribeUser = onSnapshot(userRef, (userSnap) => {
          if (userSnap.exists()) {
            const joined = userSnap.data().joinedBusinesses || {};
            if (joined[businessId]) {
              setCardData(joined[businessId]);
            } else {
              setCardData(null); // user left the business or never joined
            }
          }
          setLoading(false);
        });

        // Real-time listener for logs
        const historyRef = collection(db, `users/${user.uid}/history`);
        const q = query(historyRef, orderBy('timestamp', 'desc'), limit(10));
        unsubscribeLogs = onSnapshot(q, (snap) => {
          const fetchedLogs = snap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(log => log.businessId === businessId);
          setLogs(fetchedLogs);
        });
      });
    };

    init();

    return () => {
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeLogs) unsubscribeLogs();
    };
  }, [businessId]);

  if (loading) return <p>Loading...</p>;
  if (!cardData) return <p>Kort ikke fundet eller ikke tilsluttet.</p>;

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <FixedNavbar title="Card detail" />

      {/* Display the Loyalty Card */}
      <div className="mt-20 w-full max-w-md flex justify-center">
        <LoyaltyCard
          businessId={businessId}
          userId={customerId}
          name={cardData.name}
          cardName={cardData.cardName}
          logoUrl={cardData.logoUrl}
          stamps={cardData.stamps}
          stampsNeeded={cardData.stampsNeeded}
          
        />
      </div>

      {/* Logs Container */}
      <div className="mt-6 w-full max-w-sm bg-white shadow-md rounded-xl p-4">
        <h2 className="text-md text-gray-800 font-semibold mb-4">Seneste aktivitet</h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">Ingen aktivitet endnu.</p>
        ) : (
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            {logs.map((log) => (
              <div key={log.id} className="contents">
                <div className="text-gray-600">
                  {log.timestamp?.toDate().toLocaleDateString()}
                </div>
                <div className="text-gray-800 flex justify-end">
                  {log.type === 'stamp'
                    ? 'Du har modtaget et stempel'
                    : log.type === 'redeem'
                    ? 'Du har indløst en belønning'
                    : log.type}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      {cardData.type === 'stamp' && customerId && (
        <div className="fixed bottom-6 w-full px-6">
          <button
            onClick={() => setShowQr(true)}
            className="w-full py-3 bg-[#385C32] text-white rounded-xl font-semibold shadow-md"
          >
            Vis QR-kode
          </button>
        </div>
      )}

      {/* QR Modal */}
      {showQr && (
        <QrModal
          businessId={businessId}
          customerId={customerId}
          shortId={cardData.shortId} 
          onClose={() => setShowQr(false)}
          logoUrl={cardData.logoUrl}
          cardName={cardData.cardName}
        />
      )}
    </div>
  );
}
