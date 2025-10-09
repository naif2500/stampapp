'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function CongratsModal({ isOpen, onClose, cardName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl text-center w-[320px] relative"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* Close Button */}
            
            <div className='px-8 pt-8 pb-4'>
            {/* Header */}
            <h2 className="text-2xl font-bold mb-4">Tillykke!</h2>

            {/* Celebration Emoji */}
            <div className="text-6xl mb-4">🎉</div>

            {/* Description */}
            <p className="text-gray-700 text-sm">
              Du kan nu indløse <span className="font-semibold">{cardName}</span>
            </p>
</div>

             <div className=" border-t border-gray-300">
              <button
                onClick={onClose}
                className="w-full py-4 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
