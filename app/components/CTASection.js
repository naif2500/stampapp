'use client';

export default function CTASection() {
  return (
    <section className="py-20 px-6">
      <div className=" mx-auto bg-gradient-to-b from-[#4F59A8] via-[#6774CA] to-[#8B94E3] rounded-2xl text-white text-center p-12 shadow-lg">
        <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of businesses boosting their loyalty programs with Stampify.
          Start your journey with us today!
        </p>
        <div>
          <button className="bg-white text-[#6774CA] font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
}
