'use client';
import { useEffect, useState, useRef } from 'react';
import { Info, Home, User, Plus, ChevronRight} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, getDoc, getDocs, doc} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { QrCodeIcon } from '@heroicons/react/24/solid';
import { getAuth, onAuthStateChanged ,setPersistence, browserLocalPersistence } from 'firebase/auth';
import Image from 'next/image';
import { getFunctions, httpsCallable } from "firebase/functions";


const QrScanner = dynamic(() => import('../components/modals/QrScanner'), { ssr: false });

export default function AdminPage() {
  const [customers, setCustomers] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const itemsPerPage = 5; 



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

useEffect(() => {
  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false)
    }
  }
  document.addEventListener("mousedown", handleClickOutside)
  return () => document.removeEventListener("mousedown", handleClickOutside)
}, [])



async function handleUpdateStampOrRedeemBoth(userId, businessId) {
  
  const functions = getFunctions(undefined, "europe-north1");
  const updateStampOrRedeemFn = httpsCallable(functions, "updateStampOrRedeem");

  try {
    const result = await updateStampOrRedeemFn({ userId, businessId });
    console.log("Cloud function result:", result.data);
  } catch (error) {
    console.error("Error calling cloud function:", error);
  }
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

  

  // Search filter
  const filteredCustomers = customers.filter(c =>
    (c.shortId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
     <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F5F5]">

      
              
            
         <nav className="w-full fixed top-0 left-0 bg-[#385C32] z-40 flex items-center justify-between px-4 py-3 shadow">
  <div className="flex items-center gap-3">
    <Image
      src="/Light_green_elephant.png"
      alt="Elephant logo"
      width={30}
      height={30}
    />
    <span className="text-[#B8E986] font-semibold text-xl">Stamply</span>
  </div>

  <div className="relative" ref={menuRef}>
  <button onClick={() => setShowMenu(prev => !prev)}>
    <img
      src={businessInfo?.logoUrl || "/placeholder.png"}
      alt="Profile"
      className="w-9 h-9 rounded-full border border-white object-cover cursor-pointer"
    />
  </button>

  {showMenu && (
    <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow text-sm">
      <button
        onClick={() => {
          const auth = getAuth()
          auth.signOut()
        }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  )}
</div>

</nav>


   
         {/* Main Content */}
         <main className="flex-1 p-6 pb-24 lg:pb-6 lg:ml-4 md:mt-18 md:px-12">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Kunder</h1>

       <div className="flex items-center w-full mb-4">
  <input
    type="text"
    placeholder="Søg kunder..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); // reset to first page on search
    }}
    className="flex-1 p-2 border border-[#385C32] bg-white rounded-l focus:outline-none"
  />
  <button
    onClick={() => setCurrentPage(1)}
    className="px-4 py-2 bg-[#385C32] border border-[#385C32] text-white rounded-r hover:bg-[#2f4c29] transition"
  >
    Søg
  </button>
</div>


      

      {/* Customer Table */}
{/* Responsive Customer List */}
<div className="bg-white rounded-lg shadow">
  {/* Desktop Table */}
  <div className="hidden md:block overflow-x-auto">
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
            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-800">
                {customer.shortId || customer.id}
              </td>
              <td className="px-4 py-3 text-gray-700">Default Card</td>
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
              <td className="px-4 py-3 flex justify-center items-center gap-3">
                <button
                  onClick={() => handleUpdateStampOrRedeemBoth(customer.id, businessId)}
                  className="p-2 bg-[#B8E986] text-black rounded-lg hover:bg-[#A5DB7A] transition"
                  title={stamps === stampsNeeded ? "Redeem" : "Add Stamp"}
                >
                  <Plus className="h-5 w-5" />
                </button>
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

  {/* Mobile Cards */}
  <div className="md:hidden flex flex-col divide-y divide-gray-200">
    {paginatedCustomers.map((customer) => {
      const stamps = customer.stampCount || 0;
      const stampsNeeded = businessInfo?.stampsNeeded || 9;

      return (
        <div key={customer.id} className="p-4">
          {/* User Info */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-semibold text-gray-800">{customer.shortId || customer.id}</p>
              <p className="text-sm text-gray-500">Default Card</p>
            </div>
            <Link
              href={`/admin/customers/${customer.id}`}
              className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
              title="View customer details"
            >
              <Info className="h-5 w-5 text-gray-600" />
            </Link>
          </div>

          {/* Card Info */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">
                {stamps}/{stampsNeeded} stamps
              </p>
              <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#B8E986] transition-all duration-300"
                  style={{ width: `${Math.min((stamps / stampsNeeded) * 100, 100)}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => handleUpdateStampOrRedeemBoth(customer.id, businessId)}
              className="p-2 bg-[#B8E986] text-black rounded-lg hover:bg-[#A5DB7A] transition"
              title={stamps === stampsNeeded ? "Redeem" : "Add Stamp"}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      );
    })}
  </div>
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


      <div className="absolute bottom-2 right-2 mb-18 lg:hidden">
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
          updateStampOrRedeem={handleUpdateStampOrRedeemBoth}
          onScanSuccess={handleScanSuccess}
          onClose={() => setScanning(false)}
        />
      )}
    


    </main>
    </div>
  );
}
