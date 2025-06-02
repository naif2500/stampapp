'use client';

import { Rocket, ShieldCheck, Sparkles } from 'lucide-react';

export default function FeatureSection() {
  const features = [
    {
      Icon: Rocket,
      title: 'Hurtig Implementering',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.  ',
    },
    {
      Icon: ShieldCheck,
      title: 'Sikkerhed i Design',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    },
    {
      Icon: Sparkles,
      title: 'Smukt Simpel',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center mb-16">
       <p className="text-[#6774CA] text-lg font-semibold">Funktioner</p>

        <h2 className="text-4xl font-semibold text-gray-800">
          Hvorfor vælge Stampify?
        </h2>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          Vores platform er bygget til at forenkle din oplevelse og levere værdi hurtigt. Her er hvad der adskiller os.
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
