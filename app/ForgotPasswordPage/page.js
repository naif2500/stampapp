'use client';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email, {
        url: 'https://yourapp.com/login', // Redirect after reset
      });
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>
      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-500 text-sm">{message}</p>}
        <button type="submit" className="bg-green-600 text-white py-2 rounded">
          Send Reset Email
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Remember your password?{' '}
        <button
          className="text-blue-600 underline"
          onClick={() => router.push('/login')}
        >
          Log In
        </button>
      </p>
    </div>
  );
}
