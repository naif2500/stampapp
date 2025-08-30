'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, collection, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/lib/firebase';
import LoyaltyCard from '../../components/cards/LoyaltyCard'; // ✅ import
import { AddCardButton } from '../../components/AddCardButton';
import FixedNavbar from '../../components/FixedNavbar';

export default function BusinessDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [joinedBusinesses, setJoinedBusinesses] = useState({});

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

  const joinBusiness = async () => {
    if (!customerId || !business) return;

    const initialStamps = business.type === 'punch' ? business.stampsNeeded : 0;

    // Update user profile
    const userRef = doc(db, 'users', customerId);
const userSnap = await getDoc(userRef);
const currentJoined = userSnap.data()?.joinedBusinesses || {};

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
    await setDoc(customerRef, {
      customerId,
      stampCount: initialStamps,
      type: business.type,
      createdAt: new Date(),
    });

    router.push('/costumer');
  };

  if (!business) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-white px-4 pt-20 py-6 lg:px-24">
      
      <FixedNavbar title="Business detail" />

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

       {/* Available cards */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Available Cards</h3>
      </div>

      {/* Clickable card */}
      <div className="space-y-4">
        <div onClick={joinBusiness} className="cursor-pointer">
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
    </div>
  );
}
