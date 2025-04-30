'use client';
import { AddCardButton } from './AddCardButton';

export default function AddBusinessModal({ businesses, onClose, onJoin }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[320px] text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-black text-xl"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4">Add a Stamp Card</h2>
        {businesses.length > 0 ? (
          <ul className="space-y-4">
            {businesses.map(b => (
              <li
                key={b.id}
                className="flex justify-between items-center border rounded p-2"
              >
                <div className="text-left">
                  <div className="font-semibold">{b.name}</div>
                  <div className="text-sm text-gray-500">{b.stampsRequired} stamps</div>
                </div>
                <AddCardButton businessId={b.id} onClick={() => onJoin(b.id)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No available businesses to join</p>
        )}
      </div>
    </div>
  );
}
