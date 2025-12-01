'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function ScanRedirectPage() {
  const params = useSearchParams();
  const router = useRouter();
  const businessId = params.get('businessId');

  useEffect(() => {
    if (!businessId) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth);
        return;
      }

      router.replace(`/business/${businessId}?fromQR=true`);
    });

    return () => unsubscribe();
  }, [businessId, router]);

  return <div className="text-center mt-20">Loading...</div>;
}
