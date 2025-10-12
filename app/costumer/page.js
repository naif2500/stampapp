'use client';
import { app } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QrModal from '../components/modals/QrModal';
import RedeemModal from '../components/modals/RedeemModal';
import AddBusinessModal from '../components/modals/AddBusinessModal';
import LoyaltyCard from '../components/cards/LoyaltyCard';
import { useEffect, useState } from 'react';
import { Info, Check } from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, setPersistence, indexedDBLocalPersistence} from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useRef } from "react";
import CustomerNavbar from '../components/CustomerNavbar';
import CongratsModal from '../components/modals/CongratsModal';
import Spinner from '../components/ui/Spinner';



export default function CustomerPage() {
  const router = useRouter();
  const [joinedBusinesses, setJoinedBusinesses] = useState({});
  const [availableBusinesses, setAvailableBusinesses] = useState([]);
  const [confirmRedeem, setConfirmRedeem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerId, setCustomerId] = useState(null); // ✅ dynamic state
  const [showQrForBusinessId, setShowQrForBusinessId] = useState(null);
  const [notification, setNotification] = useState(null);
  const prevDataRef = useRef({}); // 🔥 store previous state without triggering re-render
  const [loading, setLoading] = useState(true);


  // ✅ Fetch authenticated user ID
  useEffect(() => {
    const auth = getAuth();
 setPersistence(auth, indexedDBLocalPersistence)
    .then(() => {
      // persistence set correctly for PWA
    })
    .catch((err) => console.error('Failed to set persistence', err));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        setCustomerId(uid);

        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setJoinedBusinesses(userSnap.data().joinedBusinesses || {});
        }
      }  else {
        // ❗ Redirect to login page if unauthenticated
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

useEffect(() => {
  if (!customerId) return;

  const userRef = doc(db, "users", customerId);

  const unsubscribe = onSnapshot(userRef, (userSnap) => {
    if (userSnap.exists()) {
      const newData = userSnap.data().joinedBusinesses || {};
      const oldData = prevDataRef.current;

      for (const [businessId, newCard] of Object.entries(newData)) {
        const oldCard = oldData[businessId];
        if (
          oldCard &&
          newCard.type === "stamp" &&
          newCard.stamps > (oldCard.stamps || 0)
        ) {
          setNotification(`Du har modtaget et stempel for ${newCard.name}!`);
          setTimeout(() => setNotification(null), 3000);
        }
      }

      for (const [businessId, newCard] of Object.entries(newData)) {
  const oldCard = oldData[businessId];
  
  // Notify when a stamp is added
  if (oldCard && newCard.stamps > (oldCard.stamps || 0)) {
    setNotification(`Du har modtaget et stempel for ${newCard.name}!`);
  }

  // Show redeem modal when stamps reach the max
  if (oldCard && newCard.stamps === newCard.stampsNeeded && oldCard.stamps < newCard.stampsNeeded) {
    setConfirmRedeem(businessId); // opens your RedeemModal
  }
}
     

      prevDataRef.current = newData; // ✅ update ref for next comparison
      setJoinedBusinesses(newData);
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, [customerId]);



  

  const joinBusiness = async (businessId) => {
    if (!customerId) return;
    const businessRef = doc(db, 'businesses', businessId);
    const businessSnap = await getDoc(businessRef);
  
    const businessData = businessSnap.data();
    const { stampsNeeded, name, cardName, type, logoUrl} = businessData;
  
    const initialStamps = type === 'punch' ? stampsNeeded : 0;
  
    const userRef = doc(db, 'users', customerId);
    const updated = {
      ...joinedBusinesses,
      [businessId]: {
        stamps: initialStamps,
        name,
        cardName,
        type,
        logoUrl,
        stampsNeeded,
      },
    };
  
    await updateDoc(userRef, { joinedBusinesses: updated });
    setJoinedBusinesses(updated);
    setShowAddModal(false);

    
  };
  
  const handleRedeemConfirm = async () => {
    if (!customerId || !confirmRedeem) return;
  
    try {
      const functions = getFunctions(app, 'europe-west1');
      const redeemStamp = httpsCallable(functions, 'redeemStamp');
  
      await redeemStamp({
        businessId: confirmRedeem,
      });
  
      // Refresh user data after successful redemption
      const userRef = doc(db, 'users', customerId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setJoinedBusinesses(userSnap.data().joinedBusinesses || {});
      }
  
      setConfirmRedeem(null);
      
     
    

    } catch (error) {
      console.error('Redemption failed:', error);
      alert(error.message || 'Redemption failed. Please try again.');
    }
  };
  
  

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {notification && (
  <div
    className="fixed top-6 left-1/2 -translate-x-1/2 z-50 
               bg-white text-gray-800 px-2 mb:px-6 py-3 
               rounded-2xl shadow-xl flex items-center gap-3
               border border-gray-200"
  >
    <div className="bg-green-500 text-white rounded-full p-1.5 flex items-center justify-center">
      <Check className="w-5 h-5" />
    </div>
    <span className="font-medium">{notification}</span>
  </div>
)}


      {/* Sidebar (desktop) / Navbar (mobile) */}
      <CustomerNavbar />
      {/* Main Content */}
      <main className="flex-1 p-6 pb-24 lg:pb-6 lg:ml-10 ">
        <div className="flex text-gray-800 justify-between items-center pt-4 mb-4">
          <h1 className="text-4xl font-bold">Hjem</h1>
        </div>

       {loading ? (
  <div className="flex flex-col items-center justify-center flex-grow">
    <Spinner />
  </div>
) : Object.keys(joinedBusinesses).length === 0 ? (
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
                  } else {
                    setConfirmRedeem(businessId);
                  }
                }}
              />
            ))}
          </div>
        )}

{confirmRedeem && joinedBusinesses[confirmRedeem]?.type !== 'stamp' && (
  <RedeemModal
            isOpen={true}
            onClose={() => setConfirmRedeem(null)}
            onConfirm={handleRedeemConfirm}
            name={joinedBusinesses[confirmRedeem].name}
            cardName={joinedBusinesses[confirmRedeem].cardName}
          />
        )}
        {showQrForBusinessId && (
          <QrModal
             businessId={showQrForBusinessId}
            customerId={customerId}
            logoUrl={joinedBusinesses[showQrForBusinessId]?.logoUrl}
            cardName={joinedBusinesses[showQrForBusinessId]?.cardName}
            onClose={() => setShowQrForBusinessId(null)}
          />
        )}
        

        {showAddModal && (
          <AddBusinessModal
            businesses={availableBusinesses}
            customerId={customerId}
            onClose={() => setShowAddModal(false)}
            onJoin={joinBusiness}
          />
        )}

        {confirmRedeem && joinedBusinesses[confirmRedeem]?.stamps === joinedBusinesses[confirmRedeem]?.stampsNeeded && (
  <CongratsModal
    isOpen={true}
    onClose={() => setConfirmRedeem(null)}
    cardName={joinedBusinesses[confirmRedeem]?.cardName}
  />
)}

      </main>
    </div>
  );
}