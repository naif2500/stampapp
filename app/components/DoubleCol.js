// components/HeroSection.js
import Image from 'next/image';
import NavbarInverted from "./NavbarInverted";


export default function Col() {
  return (
    <section className=" text-[#1A1A1A] rounded-2xl p-4">
      <div className=" mx-auto flex flex-col-reverse md:flex-row items-center px-12 py-16 space-y-10 md:space-y-0">
      <div className="bg-[#333333] rounded-2xl flex-1 relative w-full h-[400px] md:h-[500px]">
          <Image
            src="/phone-mockup.png" // You need to add the phone mockup to your /public folder
            alt="Phone mockup"
            layout="fill"
            objectFit="contain"
          />
        </div>

        <div className="ml-6 flex-1 space-y-4">
        <p className="text-[#6774CA] text-lg font-semibold">How it works</p>
          <h1 className="text-4xl text-gray-800 font-semibold leading-tight">
            Manage Your Money <br /> Seamlessly
          </h1>
          <p className="text-lg text-gray-600">
            Experience the future of finance with Wildcrafted. Track your expenses, send money, grow your savings, and enjoy advanced security features, all in one easy-to-use app.
          </p>

          
        </div>

       

      </div>
    </section>
  );
}
