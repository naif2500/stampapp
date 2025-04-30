// components/PunchCard.js
'use client';

import React from 'react';

const PunchCard = ({ businessId, name, cardName, stamps, onClick }) => {
  return (
    <div
      key={businessId}
      className="relative bg-gradient-to-b from-[#b8c1f7] to-[#d3d8fa] cursor-pointer rounded-2xl shadow-lg w-full max-w-[340px] p-6 flex flex-col justify-between transition-transform transform hover:scale-[1.02]"
      onClick={() => onClick(businessId)}
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
};

export default PunchCard;
