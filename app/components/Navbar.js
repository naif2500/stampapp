'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow p-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-xl font-bold text-[#6774CA]">
        <Link href="/">Stampify</Link>
      </div>

      {/* Center menu */}
      <div className="hidden md:flex gap-6 text-sm text-gray-600">
        <Link href="/about" className="hover:text-blue-500">About</Link>
        <Link href="/features" className="hover:text-blue-500">Features</Link>
        <Link href="/contact" className="hover:text-blue-500">Contact</Link>
      </div>

      {/* Right buttons */}
      <div className="flex gap-2">
        <Link href="/login">
          <button className="px-4 py-1 border border-[#6774CA] text-[#6774CA] rounded hover:bg-blue-50 text-sm">
            Log In
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-4 py-1 bg-[#6774CA] text-white rounded hover:bg-blue-600 text-sm">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
