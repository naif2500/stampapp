'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className=" w-full bg-[#6774CA] shadow p-4 flex justify-between items-center">
    {/* Logo */}
         <div className="text-xl font-bold text-white">
           <Link href="/">Stampify</Link>
         </div>
   
         {/* Center menu */}
         <div className="hidden md:flex gap-20 text-sm text-white">
           <Link href="/about" className="hover:text-blue-500">About</Link>
           <Link href="/features" className="hover:text-blue-500">Features</Link>
           <Link href="/contact" className="hover:text-blue-500">Contact</Link>
         </div>
   
         {/* Right buttons */}
         <div className="flex gap-2">
           <Link href="/login">
             <button className="px-4 py-1 border border-white text-white rounded hover:bg-blue-50 text-sm">
               Log In
             </button>
           </Link>
           <Link href="/signup">
             <button className="px-4 py-1 bg-white text-[#6774CA] rounded hover:bg-blue-600 text-sm">
               Sign Up
             </button>
           </Link>
         </div>
  </nav>
  );
}
