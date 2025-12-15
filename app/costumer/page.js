'use client';
import { useRouter } from 'next/navigation';
import LoyaltyCard from '../components/cards/LoyaltyCard';
import { useEffect, useState } from 'react';
import { Info, Check } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import {
  doc,
  onSnapshot,
} from 'firebase/firestore';
import {onAuthStateChanged} from 'firebase/auth';
import { useRef } from "react";
import CongratsModal from '../components/modals/CongratsModal';
import Spinner from '../components/ui/Spinner';



export default function CustomerPage() {
   const router = useRouter();

  const [customerId, setCustomerId] = useState(null);
  const [joinedBusinesses, setJoinedBusinesses] = useState({});
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsCardName, setCongratsCardName] = useState(null);

  const prevDataRef = useRef({});

  // Observe auth only
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setCustomerId(user.uid);
    });

    return () => unsubscribe();
  }, []);

  // Observe user data
  useEffect(() => {
    if (!customerId) return;

    const userRef = doc(db, 'users', customerId);

    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      const newData = snap.data().joinedBusinesses || {};
      const oldData = prevDataRef.current;

      for (const [businessId, newCard] of Object.entries(newData)) {
        const oldCard = oldData[businessId];
        if (!oldCard) continue;

        const oldStamps = oldCard.stamps || 0;
        const newStamps = newCard.stamps || 0;

        // Stamp received notification
        if (
          newCard.type === 'stamp' &&
          newStamps > oldStamps
        ) {
          setNotification(`Du modtog et stempel for ${newCard.name}!`);
          setTimeout(() => setNotification(null), 3000);
        }

        // Congrats modal only when threshold is crossed
        if (
          oldStamps < newCard.stampsNeeded &&
          newStamps === newCard.stampsNeeded
        ) {
          setCongratsCardName(newCard.cardName);
          setShowCongrats(true);
        }
      }

      prevDataRef.current = newData;
      setJoinedBusinesses(newData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }


  
  

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {notification && (
  <div
    className="fixed top-6 left-1/2 -translate-x-1/2 z-50 
               bg-white text-gray-800 px-2 mb:px-6 py-3 
               rounded-2xl shadow-xl flex items-center gap-3
               border border-gray-200 whitespace-nowrap"
  >
    <div className="bg-green-500 text-white rounded-full p-1.5 flex items-center justify-center">
      <Check className="w-5 h-5" />
    </div>
    <span className="font-medium">{notification}</span>
  </div>
)}


      
      {/* Main Content */}
      <main className="flex-1 p-6 pb-24 lg:pb-6 lg:ml-10 ">
        <div className="flex text-gray-800 justify-between items-center pt-4 mb-4">
          <h1 className="text-4xl font-bold">Hjem</h1>
        </div>

       {Object.keys(joinedBusinesses).length === 0 ? (
  <div className="flex flex-col items-center justify-center flex-grow text-gray-400">
    <Info className="w-16 h-16 mb-4" />
    <p className="text-center text-lg">Klik på plus knappen for at tilføje et stempelkort</p>
  </div>
) : (
          <div className="flex flex-wrap gap-4">
            {Object.entries(joinedBusinesses).map(([businessId, data]) => (
              <LoyaltyCard
                key={businessId}
                businessId={businessId}
                userId={customerId}
                name={data.name}
                cardName={data.cardName}
                stamps={data.stamps}
                type={data.type}
                logoUrl={data.logoUrl}
                stampsNeeded={data.stampsNeeded}
                onClick={() => {
                  if (data.type === 'stamp') {
                    router.push(`/cards/${businessId}`);
                  }
                }}
              />
            ))}
          </div>
        )}


        



       {showCongrats && (
        <CongratsModal
          isOpen={true}
          onClose={() => setShowCongrats(false)}
          cardName={congratsCardName}
        />
      )}

      </main>
    </div>
  );
}