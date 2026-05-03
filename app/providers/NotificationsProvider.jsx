'use client';

import { useEffect, useRef, useState, createContext, useContext } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import CongratsModal from '@/components/modals/CongratsModal';
import { Check } from 'lucide-react';

const LoyaltyNotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [congratsCardName, setCongratsCardName] = useState<string | null>(null);

  const prevDataRef = useRef<any>({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) setCustomerId(user.uid);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!customerId) return;

    const userRef = doc(db, 'users', customerId);

    const unsub = onSnapshot(userRef, snap => {
      if (!snap.exists()) return;

      const newData = snap.data().joinedBusinesses || {};
      const oldData = prevDataRef.current;

      for (const [businessId, newCard] of Object.entries(newData)) {
        const oldCard = oldData[businessId];
        if (!oldCard) continue;

        const oldStamps = oldCard.stamps || 0;
        const newStamps = newCard.stamps || 0;

        if (newCard.type === 'stamp' && newStamps > oldStamps) {
          setNotification(`Du modtog et stempel for ${newCard.name}!`);
          setTimeout(() => setNotification(null), 3000);
        }

        if (
          oldStamps < newCard.stampsNeeded &&
          newStamps === newCard.stampsNeeded
        ) {
          setCongratsCardName(newCard.cardName);
          setShowCongrats(true);
        }
      }

      prevDataRef.current = newData;
    });

    return unsub;
  }, [customerId]);

  return (
    <LoyaltyNotificationsContext.Provider value={null}>
      {children}

      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                        bg-white text-gray-800 px-6 py-3
                        rounded-2xl shadow-xl flex items-center gap-3
                        border border-gray-200">
          <div className="bg-green-500 text-white rounded-full p-1.5">
            <Check className="w-5 h-5" />
          </div>
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {showCongrats && (
        <CongratsModal
          isOpen={true}
          onClose={() => setShowCongrats(false)}
          cardName={congratsCardName}
        />
      )}
    </LoyaltyNotificationsContext.Provider>
  );
}
