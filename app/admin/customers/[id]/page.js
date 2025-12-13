'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { Info, Home, User, ArrowLeft, ChevronRight } from 'lucide-react';
import Spinner from '../../../components/ui/Spinner';


export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id;

  const [customer, setCustomer] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState(null);

  // Tabs & pagination
  const [activeTab, setActiveTab] = useState('info');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/BusinessLoginPage');
        return;
      }

      setBusinessId(user.uid);

      const customerRef = doc(db, `businesses/${user.uid}/customers`, customerId);
      const customerSnap = await getDoc(customerRef);

      if (!customerSnap.exists()) {
        setLoading(false);
        return;
      }

      setCustomer(customerSnap.data());

      const historyRef = collection(db, `businesses/${user.uid}/customers/${customerId}/history`);
      const historySnap = await getDocs(historyRef);

      const customerLogs = historySnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      customerLogs.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
      setLogs(customerLogs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [customerId, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600"><Spinner /></div>;
  }

  if (!customer) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Customer not found.</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const paginatedLogs = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F5F5F5]">

      {/* Sidebar (same as Admin Page) */}
      <nav className="
        fixed bottom-0 left-0 w-full bg-[#385C32] border-t shadow-lg z-40
        flex justify-around items-center py-3
        lg:sticky lg:flex-col lg:justify-between lg:items-start lg:w-auto lg:h-screen lg:pr-2
      ">
        <div className="hidden lg:flex items-center gap-3 px-5 pt-6">
          <Image
            src="/Light_green_elephant.png"
            alt="Elephant logo"
            width={30}
            height={30}
          />
          <span className="text-[#B8E986] font-semibold text-xl">Stampify</span>
        </div>

        <div className="flex flex-1 justify-around py-2 lg:justify-start w-full lg:flex-col lg:items-start lg:gap-6 lg:px-5 lg:mt-10">
          <Link href="/admin" className="flex items-center gap-2 text-white hover:text-[#B8E986] transition">
            <Home className="w-6 h-6" />
            <span className="hidden lg:inline">Home</span>
          </Link>
          <Link href="/admin" className="flex items-center gap-2 text-white hover:text-[#B8E986] transition">
            <User className="w-6 h-6" />
            <span className="hidden lg:inline">Profile</span>
          </Link>
        </div>

        <button
          onClick={() => {
            const auth = getAuth();
            auth.signOut();
          }}
          className="hidden lg:flex items-center gap-2 text-white hover:text-[#B8E986] transition mb-6 px-5"
        >
          <Info className="w-6 h-6 rotate-180" />
          <span>Logout</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-24 lg:pb-6 lg:ml-4 md:mt-6">

      

        {/* Breadcrumb Trail */}
        <div className="flex items-center text-sm text-gray-600 mb-6">
          <Link href="/admin" className="hover:text-[#385C32] transition">Admin</Link>
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
          <Link href="/admin" className="hover:text-[#385C32] transition">Customers</Link>
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
          <span className="font-semibold text-gray-800 truncate max-w-[160px]">{customer.name || customerId}</span>
        </div>

       

        {/* Header */}
        <h1 className="text-xl font-bold text-gray-800 mb-2">{customer.name || customerId}</h1>
        <p className="text-gray-600 mb-6">Customer details and stamp history</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2 px-2 font-medium text-sm transition ${
              activeTab === 'info'
                ? 'border-b-2 border-[#385C32] text-[#385C32]'
                : 'text-gray-500 hover:text-[#385C32]'
            }`}
          >
            Loyalty Info
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2 px-2 font-medium text-sm transition ${
              activeTab === 'history'
                ? 'border-b-2 border-[#385C32] text-[#385C32]'
                : 'text-gray-500 hover:text-[#385C32]'
            }`}
          >
            History
          </button>
        </div>

        {/* Loyalty Info Tab */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Loyalty Info</h2>
            <p className="text-gray-700">
              <strong>Stamp Count:</strong> {customer.stampCount ?? 0}
            </p>
            {customer.lastStampTime && (
              <p className="text-gray-500 text-sm mt-1">
                Last stamp: {new Date(customer.lastStampTime.seconds * 1000).toLocaleString()}
              </p>
            )}
            {customer.lastRedeemTime && (
              <p className="text-gray-500 text-sm mt-1">
                Last redeem: {new Date(customer.lastRedeemTime.seconds * 1000).toLocaleString()}
              </p>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Loyalty History</h2>
            {logs.length === 0 ? (
              <p className="text-gray-600">No history found.</p>
            ) : (
              <>
                <ul className="divide-y divide-gray-200">
                  {paginatedLogs.map((log) => (
                    <li key={log.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800 capitalize">{log.type}</p>
                        <p className="text-sm text-gray-500">{log.timestamp?.toDate().toLocaleString()}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          log.type === 'stamp'
                            ? 'bg-[#B8E986] text-[#2f4c29]'
                            : 'bg-[#385C32] text-white'
                        }`}
                      >
                        {log.type === 'stamp' ? 'Stamp Added' : 'Redeemed'}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
                    >
                      Prev
                    </button>
                    <span className="text-gray-700 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
