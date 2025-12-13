// components/FixedNavbar.js
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function FixedNavbar({ title, showBack = true, rightContent = null }) {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 w-full  z-50 flex items-center justify-between px-4 py-3">
      {/* Left side (Back button) */}
      <div className="flex items-center">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#6774CA] hover:text-black"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
          </button>
        )}
      </div>

      {/* Center (Page title) */}
      {title && (
        <h1 className="text-lg font-medium text-gray-800 text-center flex-1">
          {title}
        </h1>
      )}

      {/* Right side (optional action slot) */}
      <div className="flex items-center">{rightContent}</div>
    </div>
  );
}
