// components/HeroSection.js
import Image from 'next/image';
import NavbarInverted from "./NavbarInverted";


export default function Col2() {
  return (
    <section className=" text-[#1A1A1A] rounded-2xl p-4">
      <div className=" mx-auto flex flex-col-reverse md:flex-row items-center px-12 py-16 space-y-10 md:space-y-0">
      

        <div className="ml-6 flex-1 space-y-4">
        <p className="text-[#385C32] text-lg font-semibold">Hvordan det virker</p>
          <h1 className="text-4xl text-gray-800 font-semibold leading-tight" style={{ fontFamily: 'var(--font-unbounded)' }}>
          Nem loyalitet for alle!          </h1>
          <p className="text-lg text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec ex lectus. Morbi iaculis quam pellentesque nisl hendrerit suscipit.  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec ex lectus. Morbi iaculis quam pellentesque nisl hendrerit suscipit.        </p>

          
        </div>

        <div className="bg-[#B8E986] rounded-2xl flex-1 relative w-full h-[400px] md:h-[500px]">
          <Image
            src="/phone-mockup.png"
            alt="Phone mockup"
            layout="fill"
            objectFit="contain"
          />
        </div>

       

      </div>
    </section>
  );
}
