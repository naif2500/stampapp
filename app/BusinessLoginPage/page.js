'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function BusinessLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin'); // Redirect to business dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <div className="flex flex-col max-w-sm mx-auto mt-20 p-6 bg-white rounded-lg">
    
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
     

      <h2 className="text-2xl text-center font-bold text-gray-700 mb-2">
        Butik login
      </h2>

      <p className="text-gray-600 text-center mb-8">
        Log ind på din virksomhedskonto
      </p>

      <input
        type="email"
        placeholder="Email"
        className="p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-[#385C32] text-white py-2 rounded"
      >
        Log ind
      </button>

      <p className="text-center text-sm mt-2 text-gray-600">
        Har du ikke en konto?{" "}
        <a
          href="/business-signup"
          className="text-[#385C32] font-semibold underline"
        >
          Opret virksomhed
        </a>
      </p>

      <p className="text-center text-sm mt-2">
        <a
          href="/forgot-password"
          className="text-[#385C32] underline"
        >
          Glemt adgangskode?
        </a>
      </p>
    </form>
  </div>
);

}
