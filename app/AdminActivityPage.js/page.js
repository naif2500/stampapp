'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  getDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

export default function AdminActivityPage() {
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminBusinessId, setAdminBusinessId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          router.push('/login');
          return;
        }

        const userData = userSnap.data();

        if (!userData.businessId) {
          console.warn('No businessId found for admin');
          setLoading(false);
          return;
        }

        setAdminBusinessId(userData.businessId);

        const q = query(
          collection(db, 'activityLogs'),
          where('businessId', '==', userData.businessId),
          orderBy('timestamp', 'desc')
        );

        const snap = await getDocs(q);
        const logs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setActivityLogs(logs);
      } catch (err) {
        console.error('Error fetching admin or logs:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p className="p-6">Loading activity...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Activity Log</h1>
      {activityLogs.length === 0 ? (
        <p className="text-gray-500">No activity found for your business.</p>
      ) : (
        <ul className="space-y-4">
          {activityLogs.map((log) => (
            <li key={log.id} className="bg-white p-4 shadow rounded-md">
              <div className="flex justify-between">
                <p className="text-gray-800 font-medium">
                  {log.userName || log.userId}{' '}
                  {log.type === 'redeem' ? 'redeemed a reward' : 'joined your program'}
                </p>
                <p className="text-sm text-gray-500">
                  {format(
                    log.timestamp?.toDate?.() || new Date(),
                    'PPpp'
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
