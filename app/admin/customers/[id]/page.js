'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import FixedNavbar from '../../../components/FixedNavbar';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id;

  const [customer, setCustomer] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/BusinessLoginPage'); // redirect if not logged in
        return;
      }

      // Logged-in user is the business
      setBusinessId(user.uid);

      // Fetch customer data
      const customerRef = doc(db, `businesses/${user.uid}/customers`, customerId);
      const customerSnap = await getDoc(customerRef);

      if (!customerSnap.exists()) {
        setLoading(false);
        return;
      }

      setCustomer(customerSnap.data());

      // Fetch history logs
      const historyRef = collection(db, `businesses/${user.uid}/customers/${customerId}/history`);
      const historySnap = await getDocs(historyRef);

      const customerLogs = historySnap.docs.map(doc => ({
        id: doc.id,
        businessId: user.uid,
        ...doc.data(),
      }));

      customerLogs.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
      setLogs(customerLogs);

      setLoading(false);
    });

    return () => unsubscribe();
  }, [customerId, router]);

  if (loading) return <p>Loading customer...</p>;

  if (!customer) return <p>Customer not found.</p>;

  return (
    <div className="p-6">
      <FixedNavbar title="Customer detail" />
      <h1 className="text-2xl font-bold mb-4">{customer.name || customerId}</h1>

      <h2 className="text-xl font-semibold mb-2">Loyalty History</h2>
      {logs.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <ul className="space-y-2">
          {logs.map(log => (
            <li key={log.id} className="border p-2 rounded">
              {log.type} on {log.timestamp.toDate().toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
