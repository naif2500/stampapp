'use client';

import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check } from 'lucide-react';

const LoyaltyCard = ({ businessId, name, cardName, onClick, logoUrl, stamps, stampsNeeded }) => {



  // Top and bottom rows
  const topRow = Math.min(5, stampsNeeded);
  const bottomRow = Math.max(0, stampsNeeded - 5);

  return (
    <div
      key={businessId}
      className="relative bg-gradient-to-br from-[#2E4632] to-[#1E2C22] cursor-pointer rounded-xl shadow-2xl w-full max-w-[350px] p-5 flex flex-col"
      onClick={() => onClick(businessId)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="h-8 w-8 rounded-full shadow-sm border-2 border-white"
        />
        <div>
          <p className="text-xs text-gray-300">{cardName}</p>
          <h3 className="text-sm font-bold text-white">{name}</h3>
        </div>
      </div>

      {/* Stamp Grid */}
      <div className="flex flex-col gap-3 items-start mb-6">
        {/* Top row */}
        <div className="flex gap-2 w-full">
          {Array.from({ length: topRow }).map((_, i) => {
            const isFilled = i < stamps;
            return (
              <div
                key={`top-${i}`}
                className={`flex-1 aspect-[55/40] max-w-[55px] rounded-md flex items-center justify-center shadow
                  ${isFilled ? 'bg-white opacity-100' : 'bg-white opacity-30'}`}
              >
                <Check className="w-1/2 h-1/2 text-[#2E4632]" />
              </div>
            );
          })}

          {/* Ghost stamps to maintain alignment */}
          {Array.from({ length: Math.max(0, 5 - topRow) }).map((_, i) => (
            <div
              key={`top-ghost-${i}`}
              className="flex-1 aspect-[55/40] max-w-[55px] invisible"
            />
          ))}
        </div>

        {/* Bottom row */}
        {bottomRow > 0 && (
          <div className="flex gap-2 w-full justify-start">
            {Array.from({ length: 5 }).map((_, i) => {
              const stampIndex = topRow + i;
              const isGhost = i >= bottomRow; // ghost filler

              return (
                <div
                  key={`bottom-${i}`}
                  className={`aspect-[55/40] max-w-[55px] w-full rounded-md flex items-center justify-center shadow 
                    ${isGhost ? 'invisible' : ''} 
                    ${stampIndex < stamps ? 'bg-white opacity-100' : 'bg-white opacity-30'}`}
                >
                  {!isGhost && <Check className="w-1/2 h-1/2 text-[#2E4632]" />}
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
