'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info } from 'lucide-react';
import FixedNavbar from '../components/FixedNavbar';


const slides = [
  { image: '/tutorial1.png' },
  { image: '/tutorial2.png' },
];

export default function TutorialPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      // Tutorial finished, redirect to main app/dashboard
      router.push('/costumer'); // or '/dashboard'
    }
  };

  return (
     <div className="min-h-screen flex flex-col bg-gray-100">
      <FixedNavbar title="Add to Home Screen" />
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-30">
        {/* Icon */}
        <Info className="w-12 h-12 text-blue-600 mb-4" />

        {/* Title */}
        <h1 className="text-lg font-bold text-center mb-2">
          Tilføj appen til din hjemmeskærm
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-center mb-6">
          Få hurtig adgang til alle dine kort
        </p>

        {/* Image */}
        <img
          src={slides[currentSlide].image}
          alt="Tutorial"
          className="w-72 h-72 object-contain mb-4"
        />

        {/* Indicators */}
        <div className="flex space-x-2 mb-6">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-4">
        <button
          onClick={handleNext}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
        >
          {currentSlide === slides.length - 1 ? 'Kom i gang' : 'Næste'}
        </button>
      </div>
    </div>
  );
}
