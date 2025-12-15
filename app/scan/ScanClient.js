'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Spinner from '../components/ui/Spinner';


export default function ScanRedirectPage() {
  const params = useSearchParams();
  const router = useRouter();
  const businessId = params.get('businessId');

  useEffect(() => {
    if (!businessId) return;
    let handled = false;

    if (!auth.currentUser) {
      signInAnonymously(auth);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
  if (handled) return;

  if (!user) {
    return;
  }

  handled = true;

  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  const joined =
    snap.exists() &&
    snap.data().joinedBusinesses &&
    snap.data().joinedBusinesses[businessId];

  if (joined) {
    router.replace('/costumer');
  } else {
    router.replace(`/business/${businessId}`);
  }
});


    return () => unsubscribe();
  }, [businessId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
            <Spinner />
          </div>
  );
}
