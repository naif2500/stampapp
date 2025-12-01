'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthInit() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth);
        return;
      }

      const userRef = doc(db, 'users', user.uid);

      await setDoc(
        userRef,
        {
          joinedBusinesses: {},
          createdAt: new Date()
        },
        { merge: true }
      );
    });

    return () => unsubscribe();
  }, []);

  return null;
}
