'use client';
import RedeemModal from '../components/RedeemModal';
import AddBusinessModal from '../components/AddBusinessModal';
import PunchCard from '../components/PunchCard';
import { useEffect, useState } from 'react';
import { Info, Home, User, Plus } from 'lucide-react';
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
  const handleRedeemConfirm = async () => {
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
    setConfirmRedeem(null); // Close the modal
  };


  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar (desktop) / Navbar (mobile) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex justify-around items-center py-3 z-40
                      lg:static lg:flex-col lg:justify-start lg:items-center lg:w-20 lg:h-screen lg:border-r">
        <a href="#" className="text-gray-600 hover:text-black">
          <User className="w-6 h-6" />
        </a>

        <button
          onClick={openAddModal}
          className="w-14 h-14 bg-[#6774CA] text-white rounded-full flex items-center justify-center shadow-md transform lg:my-6"
        >
          <Plus className="w-6 h-6" />
        </button>

        <a href="#" className="text-gray-600 hover:text-black">
          <Home className="w-6 h-6" />
        </a>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-24 lg:pb-6 lg:ml-20">
        <div className="flex text-gray-800 justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Dine kort</h1>
        </div>

        {Object.keys(joinedBusinesses).length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow text-gray-400">
            <Info className="w-16 h-16 mb-4" />
            <p className="text-center text-lg">Click the Add Stamp Card button to get started</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {Object.entries(joinedBusinesses).map(([businessId, data]) => (
              <PunchCard
                key={businessId}
                businessId={businessId}
                name={data.name}
                cardName={data.cardName}
                stamps={data.stamps}
                onClick={setConfirmRedeem}
              />
            ))}
          </div>
        )}

        {confirmRedeem && (
          <RedeemModal
            isOpen={true}
            onClose={() => setConfirmRedeem(null)}
            onConfirm={handleRedeemConfirm}
            name={joinedBusinesses[confirmRedeem].name}
            cardName={joinedBusinesses[confirmRedeem].cardName}
          />
        )}

        {showAddModal && (
          <AddBusinessModal
            businesses={availableBusinesses}
            onClose={() => setShowAddModal(false)}
            onJoin={joinBusiness}
          />
        )}
      </main>
    </div>
  );
}