'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/lib/firebase';
import LoyaltyCard from '../../components/cards/LoyaltyCard'; // ✅ import
import { useSearchParams } from 'next/navigation';
import FixedNavbar from '../../components/FixedNavbar';
import Spinner from '../../components/ui/Spinner';
import JoinBusinessModal from '../../components/modals/JoinBusinessModal';


export default function BusinessDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [joinedBusinesses, setJoinedBusinesses] = useState({});
  const searchParams = useSearchParams();
  const fromQR = searchParams.get('fromQR') === 'true';
  const [showJoinModal, setShowJoinModal] = useState(false);


  // Auth
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      setCustomerId(user.uid);
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch business
  useEffect(() => {
    const fetchBusiness = async () => {
      if (!id) return;
      const ref = doc(db, 'businesses', id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setBusiness({ id: snap.id, ...snap.data() });
      }
    };
    fetchBusiness();
  }, [id]);

  useEffect(() => {
  if (fromQR && business && customerId) {
    // ✅ Only show modal — don’t auto-join
    setShowJoinModal(true);
  }
}, [fromQR, business, customerId]);


  const joinBusiness = async () => {
    if (!customerId || !business) return;

    const initialStamps = business.type === 'punch' ? business.stampsNeeded : 0;

    // Update user profile
    const userRef = doc(db, 'users', customerId);
const userSnap = await getDoc(userRef);
const currentJoined = userSnap.data()?.joinedBusinesses || {};

try {

await updateDoc(userRef, {
  joinedBusinesses: {
    ...currentJoined,
    [business.id]: {
      stamps: initialStamps,
      name: business.name,
      cardName: business.cardName,
      type: business.type,
      logoUrl: business.logoUrl,
      stampsNeeded: business.stampsNeeded,
    },
  },
});


    // Update business customers
    const customerRef = doc(collection(db, `businesses/${business.id}/customers`), customerId);
    const userData = userSnap.data();
    await setDoc(customerRef, {
      customerId,
      name: userData.name || '',
      phone: userData.phone || '',
      stampCount: initialStamps,
      type: business.type,
      createdAt: new Date(),
    });

    console.log("Joining business:", {
  businessId: business.id,
  customerId,
  authUser: getAuth().currentUser?.uid
});

     // NEW: trigger Cloud Function
  await setDoc(doc(db, "membershipRequests", `${business.id}_${customerId}`), {
    businessId: business.id,
    customerId,
    timestamp: new Date(),
  });


    if (fromQR) {
      setShowJoinModal(true); // ✅ show modal instead of redirecting right away
    } else {
      router.push('/costumer');
    }
  } catch (error) {
    console.error("Error joining business:", error);
  }
};

  if (!business) return <div className="text-center mt-20"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-white px-4 pt-20 py-6 lg:px-24">

      <FixedNavbar title="Virksomhed detaljer" />

      {/* Top section: logo + name */}
      <div className="flex flex-col items-center text-center mb-8">
        <img
          src={business.logoUrl || '/placeholder-logo.png'}
          alt={business.name}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h2 className="text-2xl font-bold">{business.name}</h2>
        <p className="text-gray-500">{business.city || 'City Name'}</p>
      </div>

       {/* Tilgængelige kort */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Tilgængelige kort</h3>
      </div>

      {/* Clickable card */}
      <div className="space-y-4">
        <div
  onClick={!fromQR ? joinBusiness : undefined}
  className={`${fromQR ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
>
          <LoyaltyCard
            businessId={business.id}
            name={business.name}
            cardName={business.cardName}
            logoUrl={business.logoUrl}
            stampsNeeded={business.stampsNeeded}
            type={business.type}
          />
        </div>
      </div>

      {showJoinModal && (
  <JoinBusinessModal
    business={business}
    onConfirm={async () => {
      await joinBusiness();
      setShowJoinModal(false);
      router.push('/costumer');
    }}
    onClose={() => {
      setShowJoinModal(false);
      router.push('/costumer');
    }}
  />
)}


    </div>
  );
}
