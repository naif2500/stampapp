'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function JoinBusinessModal({ business, onConfirm, onCancel }) {
    if (!business) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center"
        >
          <button
            onClick={onCancel}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>

          <img
  src={business.logoUrl || '/Elephant.png'}
  alt={business.name}
  className="rounded-full border-4 border-[#B8E986] shadow-md mx-auto mb-4 w-20 h-20 object-cover"
/>

          <h2 className="text-xl font-bold text-[#385C32] mb-2">{business.name}</h2>
          <p className="text-gray-600 text-sm mb-6">
            Join {business.name}’s loyalty program and start earning stamps.
          </p>

          <button
            onClick={onConfirm}
            className="w-full py-3 bg-[#B8E986] text-[#385C32] font-semibold rounded-xl shadow-md hover:bg-[#A5DB7A] transition"
          >
            Join Loyalty Program
          </button>

          <button
            onClick={onCancel}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Maybe later
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
