'use client';

import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check } from 'lucide-react';

const LoyaltyCard = ({ businessId, userId, name, cardName, stampsNeeded, onClick, logoUrl }) => {
  const [stamps, setStamps] = useState(0);

  useEffect(() => {
    if (!userId || !businessId) return;

    const userCardRef = doc(db, `businesses/${businessId}/customers`, userId);

    const unsubscribe = onSnapshot(userCardRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStamps(data.stampCount ?? 0);
      }
    });

    return () => unsubscribe();
  }, [businessId, userId]);

  // Top and bottom rows
  const topRow = Math.min(5, stampsNeeded);
  const bottomRow = Math.max(0, stampsNeeded - 5);

  return (
    <div
      key={businessId}
      className="relative bg-gradient-to-br from-[#2E4632] to-[#1E2C22] cursor-pointer rounded-xl shadow-2xl w-full max-w-[380px] p-5 flex flex-col"
      onClick={() => onClick(businessId)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <img src={logoUrl} alt={`${name} logo`} className="h-8 w-8 rounded-full shadow-sm border-2 border-white" />
        <div>
          <h3 className="text-sm font-bold text-white">{cardName}</h3>
          <p className="text-xs text-gray-300">{name}</p>
        </div>
      </div>

      {/* Stamp Grid */}
      <div className="flex flex-col gap-3 items-start mb-6">
        {/* Top row */}
        <div className="flex gap-3">
          {Array.from({ length: topRow }).map((_, i) => (
            <div
              key={`top-${i}`}
              className={`w-[55px] h-[40px] rounded-md flex items-center justify-center shadow 
                ${i < stamps ? 'bg-white' : 'bg-white/30'}`}
            >
              {i < stamps && <Check className="w-5 h-5 text-[#2E4632]" />}
            </div>
          ))}
        </div>

        {/* Bottom row */}
        {bottomRow > 0 && (
          <div className="flex gap-3 justify-center">
            {Array.from({ length: bottomRow }).map((_, i) => {
              const stampIndex = topRow + i;
              return (
                <div
                  key={`bottom-${i}`}
                  className={`w-[55px] h-[40px] rounded-md flex items-center justify-center shadow 
                    ${stampIndex < stamps ? 'bg-white' : 'bg-white/30'}`}
                >
                  {stampIndex < stamps && <Check className="w-5 h-5 text-[#2E4632]" />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-center text-gray-200">
        Køb {stampsNeeded} og få 1 gratis
      </p>
    </div>
  );
};

export default LoyaltyCard;
