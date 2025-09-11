'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const slides = [
  { image: '/tutorial1.png', text: 'Welcome to our app! Here’s how it works.' },
  { image: '/tutorial2.png', text: 'Scan QR codes to collect stamps.' },
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full flex flex-col items-center">
        <img src={slides[currentSlide].image} alt="Tutorial" className="mb-4 w-64 h-64 object-contain" />
        <p className="text-center mb-6">{slides[currentSlide].text}</p>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}
