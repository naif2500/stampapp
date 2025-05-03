// components/BusinessCard.js
import Image from 'next/image';

export default function BusinessCard({ coverImageUrl, logoUrl, businessName, description }) {
  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white">
      <div className="relative h-40 bg-gray-300">
        {coverImageUrl && (
          <Image
            src={coverImageUrl}
            alt="Cover Image"
            layout="fill"
            objectFit="cover"
            className="rounded-t-2xl"
          />
        )}
        <div className="absolute left-4 bottom-[-32px]">
          <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-gray-200 relative">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt="Logo"
                layout="fill"
                objectFit="cover"
              />
            )}
          </div>
        </div>
      </div>

      <div className="pt-10 px-4 pb-4">
        <h2 className="text-xl font-semibold">{businessName}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
