// components/HeroSection.js
"use client";
import Image from 'next/image';
import NavbarInverted from "./NavbarInverted";
import { motion } from "framer-motion";  // <--- import Framer Motion

export default function HeroSection() {
  return (
    <section className="text-white rounded-2xl p-4" style={{
    background: "linear-gradient(to bottom left, #81B97B 0%, #385C32 40%, #385C32 70%, #5B8B54 100%)"
  }}>
       {/* Navbar with fade-in from top */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <NavbarInverted />
      </motion.div>

      <div className="mx-auto flex flex-col-reverse md:flex-row items-center px-4 py-6 md:px-12 md:py-16 space-y-5 md:space-y-0">

        {/* Left Content */}
        <motion.div
          className="flex-1 space-y-6 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1
            className="font-unbounded text-3xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: 'var(--font-unbounded)' }}
          >
            Drop papkortene. Gør loyalitet digitalt.
          </h1>
          <p className="text-md md:text-lg text-blue-100">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec ex lectus. Morbi iaculis quam pellentesque nisl hendrerit suscipit.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="px-6 py-3 bg-[#B8E986] text-[#1a1a1a] font-semibold rounded-lg hover:bg-blue-100">
              Get started for free
            </button>
            <button className="px-6 py-3 bg-transparent text-white font-semibold rounded-lg hover:bg-blue-100">
              Book a demo
            </button>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className=" md:-mb-20 flex-1 flex justify-center relative w-full h-[350px]  md:h-[550px] overflow-hidden"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="scale-70 md:scale-90 -my-12 md:-my-0">
            <Image
              src="/phone_mockup1.png"
              alt="Phone mockup"
              width={500}
              height={800}
              objectFit="contain"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
