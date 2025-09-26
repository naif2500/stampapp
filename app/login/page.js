'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/costumer'); // or wherever your customer dashboard is
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className=" flex flex-col max-w-sm mx-auto mt-20 p-6 bg-white ">
      <img
          src="/Green_elephant.png"
          alt="Elephant"
          className="w-14 h-14 mb-6  items-center justify-center text-center mx-auto"
        />

        {/* Text */}
        <h2 className="text-2xl text-center font-bold text-black mb-2">Welcome</h2>
        <p className="text-black text-center mb-8">
          Choose an option to continue:
        </p>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-[#385C32] text-white py-2 rounded">
          Log In
        </button>
      </form>
       <p className="mt-4 text-center text-sm">
        <button
          className="text-[#385C32] underline"
          onClick={() => router.push('/ForgotPasswordPage')}
        >
          Forgot Password?
        </button>
      </p>
    </div>
  );
}
