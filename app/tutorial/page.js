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
      <FixedNavbar title="" />
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-30">

        {/* Image */}
      <div className="w-72 h-70 bg-[#B8E986] flex justify-center mb-4 rounded-lg overflow-hidden">
      <img
      src={slides[currentSlide].image}
      alt="Tutorial"
      className="w-68 h-68 object-contain -mt-10"
      />
       </div>
    
        {/* Title */}
        <h1 className="text-xl font-bold text-center mb-2">
          Tilføj til hjemmeskærm
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-center mb-6">
          Få hurtig adgang til alle dine kort ved <br /> at tilføje appen til din hjemmeskærm.
        </p>

        

        
      </div>

      {/* Bottom Button */}
      <div className="p-4">
        {/* Indicators */}
        <div className="flex justify-center space-x-2 mb-6">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentSlide ? 'bg-[#385C32]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="w-full py-3 bg-[#385C32] text-white font-medium rounded-xl hover:bg-[#2c4a24] transition"
        >
          {currentSlide === slides.length - 1 ? 'Kom i gang' : 'Næste'}
        </button>
      </div>
    </div>
  );
}
