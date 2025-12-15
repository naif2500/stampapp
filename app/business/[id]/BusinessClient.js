'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db, auth } from '@/lib/firebase';
import Spinner from '../../components/ui/Spinner';
import JoinBusinessModal from '../../components/modals/JoinBusinessModal';

export default function BusinessDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [business, setBusiness] = useState(null);

  
  useEffect(() => {
    if (!id) return;
    const ref = doc(db, 'businesses', id);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setBusiness({ id: snap.id, ...snap.data() });
      }
    });
  }, [id]);

  const ensureAnonymousAuth = async () => {
    if (auth.currentUser) return;

    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          unsubscribe();
          resolve();
        }
      });
    });

    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  };

  const joinBusiness = async () => {
     await ensureAnonymousAuth();

    const functions = getFunctions(undefined, 'europe-north1');
    const fn = httpsCallable(functions, 'joinBusiness');

await fn({ businessId: business.id });

    router.replace('/costumer');
  };

  if (!business) {
  return (
    <div className="text-center mt-20">
      <Spinner />
    </div>
  );
}

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <JoinBusinessModal
        business={business}
        onConfirm={joinBusiness}
        onCancel={() => router.replace('/costumer')}
      />
    </div>
  );
}
