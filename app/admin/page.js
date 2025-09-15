'use client';
import { useEffect, useState } from 'react';
import { Info, Home, User, Plus } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, getDoc, getDocs, doc} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { QrCodeIcon } from '@heroicons/react/24/solid';
import { getAuth, onAuthStateChanged ,setPersistence, browserLocalPersistence } from 'firebase/auth';

const QrScanner = dynamic(() => import('../components/modals/QrScanner'), { ssr: false });

export default function AdminPage() {
  const [customers, setCustomers] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 👈 Adjust as needed



  const router = useRouter();
  const auth = getAuth();

  const [businessId, setBusinessId] = useState(null);


  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .catch((error) => {
        console.error("Error setting persistence:", error);
      });
  }, [auth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, check if they are a business user
        const businessRef = doc(db, 'businesses', user.uid);
        const docSnap = await getDoc(businessRef);
        
        if (docSnap.exists()) {
          setIsAuthenticated(true);
          setBusinessId(user.uid);
        } else {
          setIsAuthenticated(false);
          router.push('/BusinessLoginPage'); // Redirect if not a business user
        }
      } else {
        setIsAuthenticated(false);
        router.push('/BusinessLoginPage'); // Redirect to login if no user is logged in
      }
      setIsLoading(false); // Set loading to false after checking auth
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, [auth, router]);

useEffect(() => {
  if (!isAuthenticated) return;

  const user = getAuth().currentUser;
  const businessId = user?.uid;
  if (!businessId) return;

  const customersRef = collection(db, `businesses/${businessId}/customers`);
  const unsubscribe = onSnapshot(customersRef, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCustomers(data);
  });

  return () => unsubscribe(); // cleanup listener
}, [isAuthenticated]);







async function updateStampOrRedeem(userId, businessId) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const userData = userSnap.data();
  const updatedBusinesses = { ...userData.joinedBusinesses };

  const card = updatedBusinesses[businessId];
  if (!card || card.type !== "stamp") return; // nothing to update

  const currentStamps = card.stamps || 0;
  const needed = card.stampsNeeded || 9;

  const customerRef = doc(db, `businesses/${businessId}/customers`, userId);
  const historyRef = collection(customerRef, "history");
  const userHistoryRef = collection(userRef, "history");

  if (currentStamps < needed) {
    // ✅ Add a stamp
    updatedBusinesses[businessId].stamps = currentStamps + 1;

    await updateDoc(customerRef, {
      stampCount: currentStamps + 1,
      lastStampTime: new Date()
    });

    await updateDoc(userRef, {
      joinedBusinesses: updatedBusinesses,
      lastStampTime: new Date()
    });

      const log = {
      type: "stamp",
      businessId,
      timestamp: new Date()
    };

    await addDoc(historyRef, log);
    await addDoc(userHistoryRef, log);

  } else if (currentStamps === needed) {
    // 🎉 Redeem
    updatedBusinesses[businessId].stamps = 0;

    await updateDoc(customerRef, {
      stampCount: 0,
      lastRedeemTime: new Date()
    });

    await updateDoc(userRef, {
      joinedBusinesses: updatedBusinesses,
      lastRedeemTime: new Date()
    });

   const log = {
      type: "redeem",
      businessId,
      timestamp: new Date()
    };

    await addDoc(historyRef, log);
    await addDoc(userHistoryRef, log);
  }

  // 🔥 Update Admin UI
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
    alert(`Added stamp for customer ${scannedId}`);
   
  }
  
  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return null; // Return nothing or show an unauthorized page if not authenticated
  }

  // 🔍 Search filter
  const filteredCustomers = customers.filter(c =>
    (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📄 Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
     <div className="min-h-screen flex flex-col lg:flex-row">
         {/* Sidebar (desktop) / Navbar (mobile) */}
         <nav className="fixed bottom-0 left-0 w-full border-t md:border-t-0 bg-white  shadow-lg flex space-y-4 items-center py-3 z-40
                         lg:static lg:flex-col lg:justify-start lg:items-center lg:w-20 lg:h-screen lg:border-r border-gray-500">
         <Link href="/admin" className="text-gray-600 hover:text-black">
       <User className="w-6 h-6" />
     </Link>
   
   
           <Link href="/admin" className="text-gray-600 hover:text-black"  
           >
             <Home className="w-6 h-6" />
           </Link>
         </nav>
   
         {/* Main Content */}
         <main className="flex-1 p-6 pb-24 lg:pb-6 lg:ml-10">
      <h1 className="text-xl font-bold mb-4">Customers</h1>

        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to first page on search
          }}
          className="w-full p-2 border rounded mb-4"
        />


      <div className="grid grid-cols-3 font-semibold border-b pb-2 mb-2">
        <div>Customer</div>
        <div>Stamps</div>
        <div>Actions</div>
      </div>

      <ul>
    {paginatedCustomers.map(customer => {
    const stamps = customer.stampCount || 0;
    const stampsNeeded = customer.stampsNeeded || 9; // fallback
    const cardName = customer.cardName || "Card"; // fallback

    return (
      <li
        key={customer.id}
        className="grid grid-cols-3 items-center border-b py-4"
      >
        {/* Customer Name / Link */}
        <div className="truncate">
          <Link
            href={`/admin/customers/${customer.id}`}
            className="text-blue-600 hover:underline"
          >
            {customer.name || customer.id}
          </Link>
        </div>

        {/* Stamp Progress */}
        <div className="flex flex-col gap-1 max-w-xs w-full">
          <div className="text-sm font-medium">
            {stamps}/{stampsNeeded}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${Math.min((stamps / stampsNeeded) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => updateStampOrRedeem( customer.id, businessId)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            {stamps === stampsNeeded ? "Redeem" : "Add Stamp"}
          </button>
        </div>
      </li>
    );
  })}
</ul>

       {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}


      <div className="absolute bottom-2 right-2 mb-6">
        <button
          onClick={() => setScanning(true)}
          className="bg-[#6774CA] text-white cursor-pointer rounded-full p-4 shadow-md transition duration-200"
        >
          <QrCodeIcon className="w-6 h-6" />
        </button>
      </div>

      {scanning && businessId && (
  <div className="mb-6 border p-4 rounded">
    <QrScanner
      businessId={businessId}
      updateStampOrRedeem={updateStampOrRedeem}
      onScanSuccess={handleScanSuccess}
    />
    <button
      onClick={() => setScanning(false)}
      className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
    >
      Cancel
    </button>
  </div>
)}

    </main>
    </div>
  );
}
