'use client';
import { useRouter } from 'next/navigation';

export default function AuthChoicePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-bold mb-6">Welcome</h2>
        <p className="mb-6 text-gray-600">
          Choose an option to continue:
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>

          <button
            onClick={() => router.push('/signup')}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
