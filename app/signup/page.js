'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create Firestore user profile
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        stamps: 0,
        createdAt: new Date(),
      });

      router.push('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Sign Up</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          {loading ? 'Signing up...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
