'use client';
import { useRouter } from 'next/navigation';

export default function AuthChoicePage() {
  const router = useRouter();

  return (
     <div className="min-h-screen flex flex-col items-center justify-center bg-[#6774CA] px-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Elephant image */}
        <img
          src="/Elephant.png"
          alt="Elephant"
          className="w-14 h-14 mb-6"
        />

        {/* Text */}
        <h2 className="text-2xl font-bold text-white mb-2">Welcome</h2>
        <p className="text-white mb-8">
          Choose an option to continue:
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => router.push('/login')}
            className="bg-white text-black py-3 rounded-full shadow hover:bg-gray-100 transition"
          >
            Log In
          </button>

          <button
            onClick={() => router.push('/signup')}
            className="bg-white text-black py-3 rounded-full shadow hover:bg-gray-100 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
