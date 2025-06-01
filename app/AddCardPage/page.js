'use client';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AddCardButton } from '../components/AddCardButton';

export default function AddBusinessPage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(null);
  const [joinedBusinesses, setJoinedBusinesses] = useState({});
  const [availableBusinesses, setAvailableBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Fetch customer ID
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      setCustomerId(user.uid);
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      if (userSnap.exists()) {
        setJoinedBusinesses(userSnap.data().joinedBusinesses || {});
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [router]);

 

  // Fetch businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      const snapshot = await getDocs(collection(db, 'businesses'));
      const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const unjoined = all.filter(b => !(b.id in joinedBusinesses));
      setAvailableBusinesses(unjoined);
    };

    if (customerId) {
      fetchBusinesses();
    }
  }, [customerId, joinedBusinesses]);

  const fetchBusinessDetails = async (id) => {
    setLoading(true);
    const ref = doc(db, 'businesses', id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setSelectedBusiness({ id: snap.id, ...snap.data() });
    }
    setLoading(false);
  };

  const joinBusiness = async (businessId) => {
    if (!customerId) return;

    const ref = doc(db, 'businesses', businessId);
    const snap = await getDoc(ref);
    const data = snap.data();

    const initialStamps = data.type === 'punch' ? data.stampsNeeded : 0;

    const userRef = doc(db, 'users', customerId);
    const updated = {
      ...joinedBusinesses,
      [businessId]: {
        stamps: initialStamps,
        name: data.name,
        cardName: data.cardName,
        type: data.type,
        logoUrl: data.logoUrl,
        stampsNeeded: data.stampsNeeded,
      },
    };

    await updateDoc(userRef, { joinedBusinesses: updated });
    router.push('/costumer');
  };

 const filteredBusinesses = availableBusinesses.filter((b) =>
  (b.name || '').toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="min-h-screen bg-white px-4 pt-20 py-6 lg:px-24">
      <button
        onClick={() => router.back()}
        className="text-sm text-blue-600 hover:underline absolute top-20 left-4 lg:left-28"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-6 mt-2 ">
        {selectedBusiness ? 'Available Cards' : 'Add a Stamp Card'}
      </h2>

      {selectedBusiness ? (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedBusiness(null)}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to businesses
          </button>

          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="font-semibold text-lg">{selectedBusiness.name}</div>
            <div className="text-sm text-gray-600 mb-3">
              {selectedBusiness.cardName} – {selectedBusiness.stampsNeeded} stamps
            </div>
            {selectedBusiness.type === 'stamp' ? (
              <button
                onClick={() => joinBusiness(selectedBusiness.id)}
                className="px-4 py-2 bg-[#6774CA] text-white rounded-lg w-full text-center font-semibold"
              >
                Join for Free
              </button>
            ) : (
              <AddCardButton
                businessId={selectedBusiness.id}
                customerId={customerId}
                onClick={() => joinBusiness(selectedBusiness.id)}
              />
            )}
          </div>
        </div>
      ) : loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search businesses..."
            className="w-full border rounded-lg p-2 mb-4"
          />
          {filteredBusinesses.length > 0 ? (
            <ul className="space-y-4">
              {filteredBusinesses.map((b) => (
                <li
                  key={b.id}
                  onClick={() => fetchBusinessDetails(b.id)}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                >
                  <div className="text-lg font-semibold">{b.name}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No businesses match your search</p>
          )}
        </>
      )}
    </div>
  );
}
