'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function JoinBusinessModal({ business, onConfirm, onCancel }) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
          

          <img
            src={business.logoUrl || '/Elephant.png'}
            alt={business.name}
            className="rounded-full border-4 border-[#B8E986] shadow-md mx-auto mb-4 w-20 h-20 object-cover"
          />

          <h2 className="text-xl font-bold text-[#385C32] mb-2">
            {business.name}
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Deltag i {business.name}'s loyalitetsprogram og start med at tjene stempler.
          </p>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 text-left mb-4">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              className="mt-1 h-4 w-4 accent-[#385C32]"
            />
            <p className="text-sm text-gray-600">
              Jeg accepterer{' '}
              <a
                href="/terms"
                target="_blank"
                className="text-[#385C32] font-semibold underline"
              >
                vilkår og betingelser
              </a>
            </p>
          </div>

          {/* Join button (disabled until accepted) */}
          <button
            disabled={!acceptedTerms}
            onClick={onConfirm}
            className={`w-full py-3 rounded-xl font-semibold shadow-md transition 
              ${
                acceptedTerms
                  ? 'bg-[#B8E986] text-[#385C32] hover:bg-[#A5DB7A]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Deltag i Loyalitetsprogram
          </button>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
