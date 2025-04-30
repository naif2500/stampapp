// components/HeroSection.js
import Image from 'next/image';
import NavbarInverted from "./NavbarInverted";


export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#4F59A8] via-[#6774CA] to-[#8B94E3] text-white rounded-2xl p-4">
      <NavbarInverted />
      <div className=" mx-auto flex flex-col-reverse md:flex-row items-center px-12 py-16 space-y-10 md:space-y-0">
        
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Manage Your Money <br /> Seamlessly
          </h1>
          <p className="text-lg text-blue-100">
            Experience the future of finance with Wildcrafted. Track your expenses, send money, grow your savings, and enjoy advanced security features, all in one easy-to-use app.
          </p>

          {/* Email Input */}
          <form className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="email"
              placeholder="What's your work email?"
              className="w-full sm:w-auto px-4 py-3 rounded-lg text-black focus:outline-none"
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-100">
              Get started for free
            </button>
          </form>
        </div>

        {/* Right Image */}
        <div className="flex-1 relative w-full h-[400px] md:h-[500px]">
          <Image
            src="/phone-mockup.png" // You need to add the phone mockup to your /public folder
            alt="Phone mockup"
            layout="fill"
            objectFit="contain"
          />
        </div>

      </div>
    </section>
  );
}
