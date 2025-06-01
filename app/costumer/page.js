'use client';
import { app } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QrModal from '../components/modals/QrModal';
import RedeemModal from '../components/modals/RedeemModal';
import AddBusinessModal from '../components/modals/AddBusinessModal';
import LoyaltyCard from '../components/cards/LoyaltyCard';
import { useEffect, useState } from 'react';
import { Info, Home, User, Plus } from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';



export default function CustomerPage() {
  const router = useRouter();
  const [joinedBusinesses, setJoinedBusinesses] = useState({});
  const [availableBusinesses, setAvailableBusinesses] = useState([]);
  const [confirmRedeem, setConfirmRedeem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerId, setCustomerId] = useState(null); // ✅ dynamic state
  const [showQrForBusinessId, setShowQrForBusinessId] = useState(null);


  // ✅ Fetch authenticated user ID
  useEffect(() => {
    const auth = getAuth();
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
  
    async function fetchData() {
      const userRef = doc(db, 'users', customerId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setJoinedBusinesses(userSnap.data().joinedBusinesses || {});
      }
    }
  
    fetchData();
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

    await logActivity({
      userId: customerId,
      businessId,
      businessName: name,
      cardName,
      type: 'join',
    });
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
      
      await logActivity({
        userId: customerId,
        businessId: confirmRedeem,
        businessName: joinedBusinesses[confirmRedeem].name,
        cardName: joinedBusinesses[confirmRedeem].cardName,
        type: 'redeem',
        stampsBefore: joinedBusinesses[confirmRedeem].stamps,
        stampsAfter: 0,
      });
    

    } catch (error) {
      console.error('Redemption failed:', error);
      alert(error.message || 'Redemption failed. Please try again.');
    }
  };
  
  

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar (desktop) / Navbar (mobile) */}
      <nav className="fixed bottom-0 left-0 w-full border-t md:border-t-0 bg-white  shadow-lg flex justify-around items-center py-3 z-40
                      lg:static lg:flex-col lg:justify-start lg:items-center lg:w-20 lg:h-screen lg:border-r border-gray-500">
      <Link href="/profile" className="text-gray-600 hover:text-black">
    <User className="w-6 h-6" />
  </Link>

        <Link href="/AddCardPage"
          className="w-14 h-14 bg-[#6774CA] cursor-pointer text-white rounded-full flex items-center justify-center shadow-md transform lg:my-6"
          >
          <Plus className="w-6 h-6" />
        </Link>

        <Link href="/costumer" className="text-gray-600 hover:text-black"  
        >
          <Home className="w-6 h-6" />
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-24 lg:pb-6 lg:ml-10">
        <div className="flex text-gray-800 justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Dine kort</h1>
        </div>

        {Object.keys(joinedBusinesses).length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow text-gray-400">
            <Info className="w-16 h-16 mb-4" />
            <p className="text-center text-lg">Click the Add Stamp Card button to get started</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {Object.entries(joinedBusinesses).map(([businessId, data]) => (
              <LoyaltyCard
                key={businessId}
                businessId={businessId}
                name={data.name}
                cardName={data.cardName}
                stamps={data.stamps}
                type={data.type}
                logoUrl={data.logoUrl}
                stampsNeeded={data.stampsNeeded}
                onClick={() => {
                  if (data.type === 'stamp') {
                    setShowQrForBusinessId(businessId);
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
            customerId={customerId}
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
      </main>
    </div>
  );
}