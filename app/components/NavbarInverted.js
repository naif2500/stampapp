'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function NavbarInverted() {
  return (
    <nav className="rounded-2xl shadow p-3 flex justify-between items-center bg-white/20 backdrop-blur-md" >
      {/* Logo */}
       <div className="flex items-center space-x-2">
        <div className='transform -scale-x-100'>
      <Image
        src="/Elephant.png"
        alt="Elephant logo"
        width={40} // adjust as needed
        height={40} // adjust as needed
      />
      </div>
      <div className="text-2xl font-bold text-white">
        <Link href="/">Stampify</Link>
      </div>
    </div>

      {/* Center menu */}
      <div className="hidden md:flex gap-20 text-lg text-white font-medium">
        <Link href="/about" className="hover:text-blue-500">About</Link>
        <Link href="/features" className="hover:text-blue-500">Features</Link>
        <Link href="/contact" className="hover:text-blue-500">Contact</Link>
      </div>

      {/* Right buttons */}
      <div className="flex gap-2">
        <Link href="/login">
          <button className="px-4 py-2 bg-white text-[#1a1a1a] rounded-lg hover:bg-[#B8E986] text-lg">
            Costumer
          </button>
        </Link>
        <Link href="/BusinessLoginPage">
          <button className="px-4 py-2 bg-[#B8E986] text-[#1a1a1a] rounded-lg hover:bg-[#A8D976] text-lg">
            Business
          </button>
        </Link>
      </div>
    </nav>
  );
}
