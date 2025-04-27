'use client';
import { useEffect, useState } from 'react';
import { AddCardButton } from '../components/AddCardButton'; 
import { Info } from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from 'firebase/firestore';

const CUSTOMER_ID = 'test-customer-id'; // Replace this dynamically later

export default function CustomerPage() {
  const [joinedBusinesses, setJoinedBusinesses] = useState({});
  const [availableBusinesses, setAvailableBusinesses] = useState([]);
  const [confirmRedeem, setConfirmRedeem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const userRef = doc(db, 'users', CUSTOMER_ID);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setJoinedBusinesses(userSnap.data().joinedBusinesses || {});
      }
    }

    fetchData();
  }, []);

  const openAddModal = async () => {
    const businessSnap = await getDocs(collection(db, 'businesses'));
    const businesses = businessSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter out already joined businesses
    const unjoined = businesses.filter(b => !(b.id in joinedBusinesses));
    setAvailableBusinesses(unjoined);
    setShowAddModal(true);
  };

  const joinBusiness = async (businessId) => {
    const businessRef = doc(db, 'businesses', businessId);
    const businessSnap = await getDoc(businessRef);
    const stampsNeeded = businessSnap.data().stampsNeeded;
    const name = businessSnap.data().name;
    const cardName = businessSnap.data().cardName;



  
    const userRef = doc(db, 'users', CUSTOMER_ID);
    const updated = {
      ...joinedBusinesses,
      [businessId]: {
        stamps: stampsNeeded,
        name: name,
        cardName: cardName,
      },
    };     
    await updateDoc(userRef, { joinedBusinesses: updated });
    setJoinedBusinesses(updated);
    setShowAddModal(false);
  };
  

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Stamp Cards</h1>
        <button
          onClick={openAddModal}
          className="px-4 py-2 cursor-pointer bg-[#6774CA] text-white rounded-lg shadow"
        >
          + Add Stamp Card
        </button>
      </div>
      {Object.keys(joinedBusinesses).length === 0 ? (
      <div className="flex flex-col items-center justify-center flex-grow text-gray-400">
        <Info className="w-16 h-16 mb-4" />
        <p className="text-center text-lg">Click the Add Stamp Card button to get started</p>
      </div>
    ) : (
      <div className="flex flex-wrap gap-4">
      {Object.entries(joinedBusinesses).map(([businessId, data]) => {
          const { stamps, name, cardName } = data;
          return (
          <div
            key={businessId}
            className="relative bg-gradient-to-b from-[#b8c1f7] to-[#d3d8fa] cursor-pointer rounded-2xl shadow-lg w-full max-w-[340px] p-6 flex flex-col justify-between transition-transform transform hover:scale-[1.02]"
            onClick={() => setConfirmRedeem(businessId)}
  disabled={stamps <= 0}
            >
<div className="flex items-center justify-between mb-12">
    <h2 className="text-lg font-semibold text-[#333]">{name}</h2>
    <span className="text-xs bg-white/60 px-3 py-1 rounded-full text-[#6774CA] font-medium shadow-inner">
      {stamps}/10
    </span>
  </div>   
  <h3 className="text-4xl font-bold text-[#333]">{cardName}</h3>
  <p className="text-sm text-gray-600 mt-2">Earn stamps with every purchase!</p>
   


          </div>
        );
        })}
      </div>
    )}
      {/* Confirm Modal */}
      {confirmRedeem && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-[320px] text-center relative">
      <button
        onClick={() => setConfirmRedeem(null)}
        className="absolute top-2 left-2 text-black text-xl"
      >
        ×
      </button>
      <h2 className="text-lg font-semibold mb-4">Confirm Redemption</h2>
      <p className="text-sm text-gray-600 mb-4">Are you sure you want to redeem one stamp?</p>
      <button
        onClick={async () => {
          const newStamps = joinedBusinesses[confirmRedeem].stamps - 1;
          const updated = {
            ...joinedBusinesses,
            [confirmRedeem]: {
              ...joinedBusinesses[confirmRedeem],
              stamps: newStamps,
            },
          };      
          const userRef = doc(db, 'users', CUSTOMER_ID);    
          await updateDoc(userRef, { joinedBusinesses: updated });
          setJoinedBusinesses(updated);
          setConfirmRedeem(null);
        }}
        className="bg-[#6774CA] text-white px-4 py-2 rounded"
      >
        Confirm
      </button>
    </div>
  </div>
)}


      {/* Add Business Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[320px] text-center relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 left-2 text-black text-xl"
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-4">Add a Stamp Card</h2>
            {availableBusinesses.length > 0 ? (
              <ul className="space-y-4">
                {availableBusinesses.map(b => (
                  <li key={b.id} className="flex justify-between items-center border rounded p-2">
                    <div className="text-left">
                      <div className="font-semibold">{b.name}</div>
                      <div className="text-sm text-gray-500">{b.stampsRequired} stamps</div>
                    </div>
                    <AddCardButton businessId={b.id} />


                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No available businesses to join</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
