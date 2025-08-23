// components/StampConfirmationModal.jsx
'use client';

export default function StampConfirmationModal({ customerName, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[300px] text-center">
        <h2 className="text-xl font-bold text-green-600 mb-2">✅ Stamp Added!</h2>
        <p className="text-gray-700 mb-4">
          {customerName ? `${customerName} just received a stamp.` : "Stamp successfully added."}
        </p>
        <button
          onClick={onClose}
          className="bg-[#6774CA] text-white px-4 py-2 rounded-lg w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
}
