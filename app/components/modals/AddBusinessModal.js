'use client';
import { useState } from 'react';
import { AddCardButton } from '../AddCardButton';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AddBusinessModal({ businesses, onClose, onJoin }) {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBusinessDetails = async (businessId) => {
    setLoading(true);
    const ref = doc(db, 'businesses', businessId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setSelectedBusiness({ id: snap.id, ...snap.data() });
    }
    setLoading(false);
  };

  const filteredBusinesses = businesses.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-white z-30 overflow-y-auto px-4 pt-20 py-6 lg:pl-24">
      <div className="max-w-2xl mx-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-gray-500 text-2xl absolute top-4 left-4 lg:left-28"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 mt-2 text-center">
          {selectedBusiness ? 'Available Cards' : 'Add a Stamp Card'}
        </h2>

        {/* Selected Business View */}
        {selectedBusiness ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedBusiness(null)}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to businesses
            </button>

            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="font-semibold text-lg">{selectedBusiness.name}</div>
              <div className="text-sm text-gray-600 mb-3">
                {selectedBusiness.cardName} – {selectedBusiness.stampsNeeded} stamps
              </div>
              {selectedBusiness.type === 'stamp' ? (
        <button
          onClick={() => onJoin(selectedBusiness.id)}
          className="px-4 py-2 bg-[#6774CA] text-white rounded-lg w-full text-center font-semibold"
        >
          Join for Free
        </button>
      ) : (
        <AddCardButton
          businessId={selectedBusiness.id}
          onClick={() => onJoin(selectedBusiness.id)}
        />
      )}
            </div>
          </div>
        ) : loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            {/* Search Input */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search businesses..."
              className="w-full border rounded-lg p-2 mb-4"
            />

            {/* Business List */}
            {filteredBusinesses.length > 0 ? (
              <ul className="space-y-4">
                {filteredBusinesses.map((b) => (
                  <li
                    key={b.id}
                    onClick={() => fetchBusinessDetails(b.id)}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="text-lg font-semibold">{b.name}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No businesses match your search</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
