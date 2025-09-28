'use client';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChevronRight } from 'lucide-react';
import CustomerNavbar from '../components/CustomerNavbar';



export default function AddBusinessPage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(null);
  const [joinedBusinesses, setJoinedBusinesses] = useState({});
  const [availableBusinesses, setAvailableBusinesses] = useState([]);
  const [search, setSearch] = useState('');

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

  const filteredBusinesses = availableBusinesses.filter((b) =>
    (b.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <CustomerNavbar />
      <main className="flex-1 bg-white px-4 pt-10 py-6 lg:px-24">
        <h2 className="text-2xl font-bold mb-6 mt-2">
          Add a Stamp Card
        </h2>
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
                onClick={() => router.push(`/business/${b.id}`)}
                className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={b.logoUrl || '/placeholder-logo.png'}
                    alt={b.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-lg">{b.name}</div>
                    <div className="text-sm text-gray-500">City Name</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No businesses match your search</p>
        )}
      </main>
    </div>
  );
}
