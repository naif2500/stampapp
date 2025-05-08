'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('businessId');
  const customerId = searchParams.get('customerId'); 
  const router = useRouter();

  useEffect(() => {
    const addCardToUser = async () => {
      if (!businessId || !customerId) return;
  
      const businessRef = doc(db, 'businesses', businessId);
      const businessSnap = await getDoc(businessRef);
  
      const userRef = doc(db, 'users', customerId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
  
      const updated = {
        ...userData.joinedBusinesses,
        [businessId]: {
          name: businessSnap.data().name,
          cardName: businessSnap.data().cardName,
          stamps: businessSnap.data().stampsNeeded,
          type: businessSnap.data().type,
        },
      };
  
      await updateDoc(userRef, { joinedBusinesses: updated });
  
      // Redirect to /customer after short delay
      setTimeout(() => {
        router.push('/costumer');
      }, 1500);
    };
  
    addCardToUser();
  }, [businessId, customerId, router]);
  

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p>We&apos;re adding your card to your dashboard...</p>
    </div>
  );
}
