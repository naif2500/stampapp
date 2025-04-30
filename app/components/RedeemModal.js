'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function RedeemModal({ isOpen, onClose, onConfirm, name, cardName }) {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSlideComplete = () => {
    setConfirmed(true);
    setTimeout(() => {
      onConfirm(); // trigger redemption
      setConfirmed(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white rounded-t-3xl w-full max-w-md p-6 shadow-lg"
      >
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Confirm Redemption</h2>
          <p className="text-center text-gray-600">
            Are you sure you want to redeem
            <br />
            <span className="font-bold">{cardName}</span> at <span className="font-bold">{name}</span>?
          </p>

          {/* Slide to Confirm */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 250 }}
            onDragEnd={(event, info) => {
              if (info.point.x > 200) handleSlideComplete();
            }}
            className="bg-gray-200 w-full h-12 rounded-full flex items-center relative cursor-pointer overflow-hidden"
          >
            <motion.div
              className={`h-full w-1/3 bg-green-500 rounded-full flex items-center justify-center text-white font-bold ${
                confirmed ? 'bg-green-700' : 'bg-green-500'
              }`}
              whileTap={{ scale: 1.1 }}
            >
              {confirmed ? 'Confirmed' : 'Slide →'}
            </motion.div>
          </motion.div>

          <button
            onClick={onClose}
            className="mt-4 text-gray-500 underline text-sm"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
