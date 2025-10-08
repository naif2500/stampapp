'use client';
import { useEffect, useState } from 'react';
import { Info, Home, User, Plus, ChevronRight} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, getDoc, getDocs, doc} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { QrCodeIcon } from '@heroicons/react/24/solid';
import { getAuth, onAuthStateChanged ,setPersistence, browserLocalPersistence } from 'firebase/auth';
import Image from 'next/image';

const QrScanner = dynamic(() => import('../components/modals/QrScanner'), { ssr: false });

export default function AdminPage() {
  const [customers, setCustomers] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [businessInfo, setBusinessInfo] = useState(null);

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
          setBusinessInfo(docSnap.data());
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
     <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F5F5]">

      
              
            
         {/* Sidebar (desktop) / Navbar (mobile) */}
         <nav className="
  fixed bottom-0 left-0 w-full bg-[#385C32] border-t shadow-lg z-40
  flex justify-around items-center py-3
  lg:static lg:flex-col lg:justify-between lg:items-start lg:w-auto lg:h-screen lg:pr-2
">
  {/* --- Top Section (Logo + Business name) --- */}
  <div className="hidden lg:flex items-center gap-3 px-5 pt-6">
    <Image
      src="/Light_green_elephant.png"
      alt="Elephant logo"
      width={30}
      height={30}
    />
    <span className="text-[#B8E986] font-semibold text-xl">Stampify</span> 
    {/* 👆 placeholder business name */}
  </div>

  {/* --- Main Nav Buttons --- */}
  <div className="flex flex-1 justify-around lg:justify-start w-full lg:flex-col lg:items-start lg:gap-6 lg:px-5 mt-10">
    {/* Profile */}
    <Link
      href="/admin"
      className="flex items-center gap-2 text-white hover:text-[#B8E986] transition"
    >
      <User className="w-6 h-6" />
      <span className="hidden lg:inline">Profile</span>
    </Link>

    {/* Home */}
    <Link
      href="/admin"
      className="flex items-center gap-2 text-white hover:text-[#B8E986] transition"
    >
      <Home className="w-6 h-6" />
      <span className="hidden lg:inline">Home</span>
    </Link>
  </div>

  {/* --- Logout Button (Desktop only) --- */}
  <button
    onClick={() => {
      const auth = getAuth();
      auth.signOut();
    }}
    className="hidden lg:flex items-center gap-2 text-white hover:text-[#B8E986] transition mb-6 px-5"
  >
    <Info className="w-6 h-6 rotate-180" /> {/* You can replace with a LogOut icon */}
    <span>Logout</span>
  </button>
</nav>

   
         {/* Main Content */}
         <main className="flex-1 p-6 pb-24 lg:pb-6 lg:ml-4 md:mt-6">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Kunder</h1>

       <div className="flex items-center w-full mb-4">
  <input
    type="text"
    placeholder="Søg kunder..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); // reset to first page on search
    }}
    className="flex-1 p-2 border border-gray-500 rounded-l focus:outline-none"
  />
  <button
    onClick={() => setCurrentPage(1)}
    className="px-4 py-2 bg-[#385C32] text-white rounded-r hover:bg-[#2f4c29] transition"
  >
    Search
  </button>
</div>


      

      {/* Customer Table */}
<div className="overflow-x-auto bg-white rounded-lg shadow">
  <table className="min-w-full border border-gray-200 text-left">
    <thead className="bg-white text-sm text-gray-800 border-b border-gray-200">
      <tr>
        <th className="px-4 py-2">Name</th>
        <th className="px-4 py-2">Card Name</th>
        <th className="px-4 py-2">Stamp Count</th>
        <th className="px-4 py-2 text-center"></th>
      </tr>
    </thead>
    <tbody>
      {paginatedCustomers.map((customer) => {
        const stamps = customer.stampCount || 0;
        const stampsNeeded = businessInfo?.stampsNeeded || 9;

        return (
          <tr
            key={customer.id}
            className=" hover:bg-gray-50 transition-colors"
          >
            {/* Name */}
            <td className="px-4 py-3 font-medium text-gray-800">
              {customer.name || customer.id}
            </td>

            {/* Card Name */}
            <td className="px-4 py-3 text-gray-700">Default Card</td>

            {/* Stamp Count + progress bar */}
            <td className="px-4 py-3">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">
                  {stamps}/{stampsNeeded}
                </span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-[#B8E986] transition-all duration-300"
                    style={{ width: `${Math.min((stamps / stampsNeeded) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </td>

            {/* Actions */}
            <td className="px-4 py-3 flex justify-center items-center gap-3">
              {/* Add stamp / redeem */}
              <button
                onClick={() => updateStampOrRedeem(customer.id, businessId)}
                className="p-2 bg-[#B8E986] text-black rounded-lg hover:bg-[#A5DB7A] transition"
                title={stamps === stampsNeeded ? "Redeem" : "Add Stamp"}
              >
                <Plus className="h-5 w-5" />
              </button>

              {/* View details */}
              <Link
                href={`/admin/customers/${customer.id}`}
                className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                title="View customer details"
              >
                <Info className="h-5 w-5 text-gray-600" />
              </Link>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>




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
          className="bg-[#B8E986] text-[#333333] cursor-pointer rounded-full p-4 shadow-md transition duration-200"
        >
          <QrCodeIcon className="w-6 h-6" />
        </button>
      </div>

      {scanning && businessId && (
        <QrScanner
          businessId={businessId}
          updateStampOrRedeem={updateStampOrRedeem}
          onScanSuccess={handleScanSuccess}
          onClose={() => setScanning(false)}
        />
      )}
    


    </main>
    </div>
  );
}
