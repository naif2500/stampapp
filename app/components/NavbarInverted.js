'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react'; // hamburger + close icons

export default function NavbarInverted() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="rounded-2xl shadow p-3 flex justify-between items-center bg-white/20 backdrop-blur-md relative">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <div className="transform -scale-x-100">
          <Image
            src="/Elephant.png"
            alt="Elephant logo"
            width={40}
            height={40}
          />
        </div>
        <div className="text-2xl font-bold text-white">
          <Link href="/">Stampify</Link>
        </div>
      </div>

      {/* Center menu (desktop only) */}
      <div className="hidden md:flex gap-20 text-lg text-white font-medium">
        <Link href="/about" className="hover:text-[#B8E986] transition">About</Link>
        <Link href="/features" className="hover:text-[#B8E986] transition">Features</Link>
        <Link href="/contact" className="hover:text-[#B8E986] transition">Contact</Link>
      </div>

      {/* Right buttons (desktop only) */}
      <div className="hidden md:flex gap-2">
        <Link href="/login">
          <button className="px-4 py-2 bg-white text-[#1a1a1a] rounded-lg hover:bg-[#B8E986] text-lg">
            Customer
          </button>
        </Link>
        <Link href="/BusinessLoginPage">
          <button className="px-4 py-2 bg-[#B8E986] text-[#1a1a1a] rounded-lg hover:bg-[#A8D976] text-lg">
            Business
          </button>
        </Link>
      </div>

      {/* Mobile burger icon */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-[#385C32]/95 backdrop-blur-md text-white rounded-b-2xl p-6 flex flex-col items-center space-y-6 z-50"
          >
            <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg hover:text-[#B8E986]">About</Link>
            <Link href="/features" onClick={() => setIsOpen(false)} className="text-lg hover:text-[#B8E986]">Features</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="text-lg hover:text-[#B8E986]">Contact</Link>

            <div className="flex flex-col gap-3 pt-4 w-full max-w-xs">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <button className="w-full px-4 py-2 bg-white text-[#1a1a1a] rounded-lg hover:bg-[#B8E986] text-lg">
                  Customer
                </button>
              </Link>
              <Link href="/BusinessLoginPage" onClick={() => setIsOpen(false)}>
                <button className="w-full px-4 py-2 bg-[#B8E986] text-[#1a1a1a] rounded-lg hover:bg-[#A8D976] text-lg">
                  Business
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
