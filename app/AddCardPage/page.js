'use client';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChevronRight, Search } from 'lucide-react';
import CustomerNavbar from '../components/CustomerNavbar';



export default function AddBusinessPage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(null);
  const [joinedBusinesses, setJoinedBusinesses] = useState({});
  const [availableBusinesses, setAvailableBusinesses] = useState([]);
  const [search, setSearch] = useState('');

  // Fetch customer ID
  useEffect(() => {
    
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
        <h2 className="text-3xl text-gray-900 font-bold mb-6 mt-2">
          Virksomheder
        </h2>
        <div className="relative w-full mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Søg..."
          className="w-full border bg-gray-200 shadow-sm border-gray-200 rounded-lg py-2 p-2 pl-10" // extra left padding for icon
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
          size={20}
        />
      </div>
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
                    <div className="font-semibold text-gray-800 text-lg">{b.name}</div>
                    <div className="text-sm text-gray-500">By, Postnummer</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Ingen virksomheder matcher din søgning</p>
        )}
      </main>
    </div>
  );
}
