'use client';

export default function CTASection() {
  return (
    <section className="py-20 px-6">
      <div className=" mx-auto bg-gradient-to-b from-[#4F59A8] via-[#6774CA] to-[#8B94E3] rounded-2xl text-white text-center p-12 shadow-lg">
        <h2 className="text-4xl font-bold mb-6">Klar til at komme i gang?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Slut dig til tusindvis af virksomheder, der styrker deres loyalitetsprogrammer med Stampify.
          Start din rejse med os i dag!
        </p>
        <div>
          <button className="bg-white text-[#6774CA] font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition">
            Kom i gang
          </button>
        </div>
      </div>
    </section>
  );
}
