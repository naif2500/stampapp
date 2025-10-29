'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // make sure you export `auth` from your firebase.js

export default function ScanRedirectPage() {
  const params = useSearchParams();
  const router = useRouter();
  const businessId = params.get('businessId');

  useEffect(() => {
    if (!businessId) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ✅ User is logged in → go straight to business page
        router.replace(`/business/${businessId}?fromQR=true`);
      } else {
        // ❌ Not logged in → go to signup page
        router.replace(`/signup?businessId=${businessId}&fromQR=true`);
      }
    });

    return () => unsubscribe();
  }, [businessId, router]);

  return <div className="text-center mt-20">Loading...</div>;
}
