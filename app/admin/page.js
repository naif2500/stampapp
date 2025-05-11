'use client';
import { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase'; // Assuming auth is exported from lib/firebase
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { QrCodeIcon } from '@heroicons/react/24/solid';
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth methods

const QrScanner = dynamic(() => import('../components/modals/QrScanner'), { ssr: false });

export default function AdminPage() {
  const [customers, setCustomers] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const router = useRouter();

  useEffect(() => {
    // Check for authentication
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If the user is logged in, check if they are a business user
        const businessRef = doc(db, 'businesses', user.uid);
        getDoc(businessRef).then((docSnap) => {
          if (docSnap.exists()) {
            setIsAuthenticated(true); // User is a business, so allow access
          } else {
            setIsAuthenticated(false); // Redirect if not a business user
            router.push('/BusinessLoginPage'); // Redirect to login page if not authenticated
          }
        });
      } else {
        setIsAuthenticated(false);
        router.push('/BusinessLoginPage'); // Redirect to login page if no user is logged in
      }
      setIsLoading(false); // Stop loading after checking auth status
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, [router]);

  useEffect(() => {
    // Fetch customers only if the user is authenticated
    if (isAuthenticated) {
      async function fetchCustomers() {
        const snapshot = await getDocs(collection(db, 'users'));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCustomers(data);
      }
      fetchCustomers();
    }
  }, [isAuthenticated]);


  useEffect(() => {
    async function fetchCustomers() {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCustomers(data);
    }

    fetchCustomers();
  }, []);

  async function addStamp(userId) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    const updatedBusinesses = { ...userData.joinedBusinesses };

    for (const [businessId, card] of Object.entries(updatedBusinesses)) {
      if (card.type === 'stamp') {
        updatedBusinesses[businessId].stamps = (card.stamps || 0) + 1;
      }
    }

    await updateDoc(userRef, {
      joinedBusinesses: updatedBusinesses,
      lastStampTime: new Date()
    });

    setCustomers(prev =>
      prev.map(c =>
        c.id === userId
          ? { ...c, joinedBusinesses: updatedBusinesses }
          : c
      )
    );
  }

  async function handleScanSuccess(scannedId) {
    setScanning(false);
    const user = customers.find(c => c.id === scannedId);
    if (user) {
      await addStamp(user.id);
      alert(`Added stamp for customer ${scannedId}`);
    } else {
      alert(`No user found with ID: ${scannedId}`);
    }
  }
  
  if (isLoading) {
    return <div>Loading...</div>; // Display a loading message while auth state is being determined
  }

  if (!isAuthenticated) {
    return null; // Return nothing or show an unauthorized page if not authenticated
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Customers</h1>

      <div className="grid grid-cols-3 font-semibold border-b pb-2 mb-2">
        <div>Customer</div>
        <div>Stamps</div>
        <div>Actions</div>
      </div>

      <ul>
        {customers.map(customer => (
          <li
            key={customer.id}
            className="grid grid-cols-3 items-center border-b py-4"
          >
            <div className="truncate">{customer.id}</div>
            {(() => {
              const stampBusinesses = customer.joinedBusinesses
                ? Object.values(customer.joinedBusinesses).filter(b => b.type === 'stamp')
                : [];

              const totalStamps = stampBusinesses.reduce(
                (acc, b) => acc + (b.stamps || 0),
                0
              );

              return (
                <div className="flex flex-col gap-1 max-w-xs w-full">
                  <div className="text-sm font-medium">
                    {totalStamps}/9
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{
                        width: `${Math.min((totalStamps / 9) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              );
            })()}
            <div>
              <button
                onClick={() => addStamp(customer.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add Stamp
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="absolute bottom-2 right-2 mb-6">
        <button
          onClick={() => setScanning(true)}
          className="bg-[#6774CA] text-white cursor-pointer rounded-full p-4 shadow-md transition duration-200"
        >
          <QrCodeIcon className="w-6 h-6" />
        </button>
      </div>

      {scanning && (
        <div className="mb-6 border p-4 rounded">
          <QrScanner onScanSuccess={handleScanSuccess} />
          <button
            onClick={() => setScanning(false)}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
