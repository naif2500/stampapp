'use client';

import { useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function AuthInit() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;


      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);

      // Only create user doc if it doesn't exist
      if (!snap.exists()) {
        await setDoc(userRef, {
          joinedBusinesses: {},
          createdAt: new Date()
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
