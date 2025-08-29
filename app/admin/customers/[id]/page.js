"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id;
  // If you need businessId, get it from params or context
  // Example: const businessId = params.businessId;

  const [customer, setCustomer] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!customerId) return;
    const fetchCustomerData = async () => {
      const customerSnap = await getDoc(doc(db, 'users', customerId));
      if (customerSnap.exists()) {
        setCustomer(customerSnap.data());
      }
      // If you have businessId, fetch logs here
    };
    fetchCustomerData();
  }, [customerId]);

  if (!customer) return <p>Loading customer...</p>;

  return (
    <div>
      <h1>{customer.name || customerId}</h1>
      {/* Render cards and logs here */}
    </div>
  );
}
