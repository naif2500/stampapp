import Link from 'next/link'; 
import { User, Plus, Home } from 'lucide-react';

export default function CustomerNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg flex justify-around items-center py-4 z-40 border-t border-gray-300
                    md:py-5 lg:static lg:flex-col lg:justify-start lg:items-center lg:w-20 lg:h-screen lg:border-r border-gray-300">

      
      
      {/* Left Icon with Text */}
       <Link href="/costumer" className="flex flex-col items-center text-gray-600 hover:text-black">
        <Home className="w-6 h-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      

      {/* Middle Button */}
      <Link
        href="/AddCardPage"
        className="w-[60px] h-[45px] bg-[#385C32] rounded-[20px] flex items-center justify-center shadow-md transform -mt-3"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>

      {/* Right Icon with Text */}
      <Link href="/profile" className="flex flex-col items-center text-gray-600 hover:text-black">
        <User className="w-6 h-6" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
}
