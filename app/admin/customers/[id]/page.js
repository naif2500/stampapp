'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import FixedNavbar from '../../../components/FixedNavbar';

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id;

  const [customer, setCustomer] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);

  useEffect(() => {
    if (!customerId) return;

    const fetchCustomerData = async () => {
      setLoading(true);

      // 1️⃣ Fetch customer info
      const customerSnap = await getDoc(doc(db, 'users', customerId));
      if (customerSnap.exists()) {
        const data = customerSnap.data();
        setCustomer(data);

        // 2️⃣ Fetch all history logs for joined businesses
        const joinedBusinesses = data.joinedBusinesses || {};
        let allLogs = [];

        for (const [businessId, card] of Object.entries(joinedBusinesses)) {
          const historyRef = collection(db, `businesses/${businessId}/customers/${customerId}/history`);
          const historySnap = await getDocs(historyRef);

          const businessLogs = historySnap.docs.map(doc => ({
            id: doc.id,
            businessId,
            businessName: card.name,
            ...doc.data(),
          }));

          allLogs = [...allLogs, ...businessLogs];
        }

        // Sort by timestamp descending
        allLogs.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());

        setLogs(allLogs);
      }

      setLoading(false);
    };

    fetchCustomerData();
  }, [customerId]);

  if (loading) return <p>Loading customer...</p>;

  // Pagination logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6">
      <FixedNavbar title="Customer detail" />

      <h1 className="text-2xl font-bold mb-4">{customer.name || customerId}</h1>

      <h2 className="text-xl font-semibold mb-2">Loyalty History</h2>
      {logs.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {currentLogs.map(log => (
              <li key={log.id} className="border p-2 rounded">
                <strong>{log.businessName}</strong> — {log.type} on {log.timestamp.toDate().toLocaleString()}
              </li>
            ))}
          </ul>

          {/* Navigation */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
