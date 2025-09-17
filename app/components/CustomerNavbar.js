import Link from 'next/link';
import { User, Plus, Home } from 'lucide-react';

export default function CustomerNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full border-t md:border-t-0 bg-white shadow-lg flex justify-around items-center py-3 z-40
                    lg:static lg:flex-col lg:justify-start lg:items-center lg:w-20 lg:h-screen lg:border-r border-gray-500">
      <Link href="/profile" className="text-gray-600 hover:text-black">
        <User className="w-6 h-6" />
      </Link>

      <Link
        href="/AddCardPage"
        className="w-14 h-14 bg-[#6774CA] cursor-pointer text-white rounded-full flex items-center justify-center shadow-md transform lg:my-6"
      >
        <Plus className="w-6 h-6" />
      </Link>

      <Link href="/costumer" className="text-gray-600 hover:text-black">
        <Home className="w-6 h-6" />
      </Link>
    </nav>
  );
}