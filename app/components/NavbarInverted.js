'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function NavbarInverted() {
  return (
    <nav className="rounded-2xl shadow p-4 flex justify-between items-center" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
      {/* Logo */}
       <div className="flex items-center space-x-2">
      <Image
        src="/Elephant.png"
        alt="Elephant logo"
        width={40} // adjust as needed
        height={40} // adjust as needed
      />
      <div className="text-2xl font-bold text-white">
        <Link href="/">Stampify</Link>
      </div>
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
          <button className="px-4 py-1 border border-[#B8E986] text-white rounded hover:bg-[#B8E986] text-lg">
            Costumer
          </button>
        </Link>
        <Link href="/BusinessLoginPage">
          <button className="px-4 py-1 bg-[#B8E986] text-[#1a1a1a] rounded hover:bg-[#A8D976] text-lg">
            Business
          </button>
        </Link>
      </div>
    </nav>
  );
}
