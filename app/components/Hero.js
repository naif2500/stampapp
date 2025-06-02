// components/HeroSection.js
import Image from 'next/image';
import NavbarInverted from "./NavbarInverted";


export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#4F59A8] via-[#6774CA] to-[#8B94E3]  text-white rounded-2xl p-4">
      <NavbarInverted />
      <div className=" mx-auto flex flex-col-reverse md:flex-row items-center px-12 py-16 space-y-10 md:space-y-0">
        
        {/* Left Content */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
         Drop papkortene. Gør loyalitet nemt og digitalt.
          </h1>
          <p className="text-lg text-blue-100">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec ex lectus. Morbi iaculis quam pellentesque nisl hendrerit suscipit.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
          <button className="px-6 py-3 bg-white text-[#6774CA] font-semibold rounded-lg hover:bg-blue-100">
              Get started for free
            </button>
            <button className="px-6 py-3 bg-transparent text-white font-semibold rounded-lg hover:bg-blue-100">
              Book a demo
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className=" -mb-20 flex-1 relative w-full h-[400px] md:h-[550px] overflow-hidden">
        <div className="absolute inset-0 scale-110"> {/* adjust scale as needed */}
    <Image
      src="/phone-mockup.png"
      alt="Phone mockup"
      layout="fill"
      objectFit="cover"
      style={{ objectPosition: '50% 20%' }}     />
  </div>
        </div>

      </div>
    </section>
  );
}
