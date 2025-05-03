'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function RedeemModal({ isOpen, onClose, onConfirm, name, cardName }) {
  const [confirmed, setConfirmed] = useState(false);
  const trackRef = useRef(null);
  const handleRef = useRef(null);

  if (!isOpen) return null;

  const handleSlideComplete = () => {
    setConfirmed(true);
    setTimeout(() => {
      onConfirm();
      setConfirmed(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
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

          {/* Slide Track */}
          <div ref={trackRef} className="relative w-full h-12 bg-[#D2D6F0] rounded-full overflow-hidden">
            <motion.div
              ref={handleRef}
              className="absolute top-0 left-0 h-12 w-1/3 bg-[#6774CA] rounded-full flex items-center justify-center text-white font-bold cursor-pointer"
              drag="x"
              dragConstraints={trackRef}
              onDragEnd={(event, info) => {
                const trackWidth = trackRef.current.offsetWidth;
                const handleWidth = handleRef.current.offsetWidth;
                const dragThreshold = trackWidth - handleWidth - 10; // 10px margin

                if (info.point.x >= dragThreshold) {
                  handleSlideComplete();
                }
              }}
              whileTap={{ scale: 1.05 }}
            >
              {confirmed ? 'Confirmed' : 'Slide →'}
            </motion.div>
          </div>

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
