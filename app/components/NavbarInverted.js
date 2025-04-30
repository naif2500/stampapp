'use client';
import Link from 'next/link';

export default function NavbarInverted() {
  return (
    <nav className="rounded-2xl shadow p-4 flex justify-between items-center" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
      {/* Logo */}
      <div className="text-2xl font-bold text-white">
        <Link href="/">Stampify</Link>
      </div>

      {/* Center menu */}
      <div className="hidden md:flex gap-20 text-lg text-white">
        <Link href="/about" className="hover:text-blue-500">About</Link>
        <Link href="/features" className="hover:text-blue-500">Features</Link>
        <Link href="/contact" className="hover:text-blue-500">Contact</Link>
      </div>

      {/* Right buttons */}
      <div className="flex gap-2">
        <Link href="/login">
          <button className="px-4 py-1 border border-white text-white rounded hover:bg-blue-50 text-lg">
            Log In
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-4 py-1 bg-white text-[#6774CA] rounded hover:bg-blue-600 text-lg">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
