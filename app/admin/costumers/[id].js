import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function CustomerDetailPage({ customerId, businessId }) {
  const [customer, setCustomer] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      // Fetch customer info
      const customerSnap = await getDoc(doc(db, 'users', customerId));
      if (customerSnap.exists()) {
        setCustomer(customerSnap.data());
      }

      // Fetch logs for that customer and business
      const logSnap = await getDocs(collection(db, `businesses/${businessId}/logs`));
      const customerLogs = logSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(log => log.customerId === customerId);
      setLogs(customerLogs);
    };

    fetchCustomerData();
  }, [customerId, businessId]);

  if (!customer) return <p>Loading customer...</p>;

  return (
    <div>
      <h1>{customer.name || customer.id}</h1>
      {/* Render cards and logs here */}
    </div>
  );
}
