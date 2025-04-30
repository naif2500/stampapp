'use client';

import { Rocket, ShieldCheck, Sparkles } from 'lucide-react';

export default function FeatureSection() {
  const features = [
    {
      Icon: Rocket,
      title: 'Fast Integration',
      description: 'Quickly plug our tools into your workflow with minimal setup and instant results.',
    },
    {
      Icon: ShieldCheck,
      title: 'Secure by Design',
      description: 'We prioritize your security using best practices and modern infrastructure.',
    },
    {
      Icon: Sparkles,
      title: 'Beautifully Simple',
      description: 'Intuitive interfaces and a clean design that feels effortless to use.',
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center mb-16">
       <p className="text-[#6774CA] text-lg font-semibold">Features</p>

        <h2 className="text-4xl font-semibold text-gray-800">
          Why Choose Stampify?
        </h2>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Our platform is built to simplify your experience and deliver value fast. Here’s what sets us apart.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {features.map(({ Icon, title, description }, idx) => (
          <div key={idx} className="text-center p-6 rounded-2xl shadow hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <Icon className="h-12 w-12 text-[#6774CA]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
