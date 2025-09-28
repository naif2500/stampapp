'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [agree, setAgree] = useState(false);

  const router = useRouter();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible', // auto trigger
      });
    }
    return window.recaptchaVerifier;
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!agree) {
      setError('You must agree to the Terms & Services to continue.');
      setLoading(false);
      return;
    }

    try {
      const appVerifier = setupRecaptcha();
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // Create Firestore user profile
      await setDoc(doc(db, 'users', user.uid), {
        name,
        phone,
        joinedBusinesses: {},
        stamps: 0,
        createdAt: new Date(),
      });

      router.push('/tutorial');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white p-8 rounded-xl max-w-sm w-full space-y-4">
        <h1 className="text-xl font-semibold text-center">Sign Up</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {!confirmationResult ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="tel"
              placeholder="Phone (e.g. +1234567890)"
              className="w-full border rounded px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

             {/* ✅ Terms checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agree}
                onChange={() => setAgree(!agree)}
                className="w-4 h-4"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="/terms" className="text-[#385C32] underline">
                  Terms & Services
                </a>
              </label>
            </div>


            <div id="recaptcha-container"></div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#385C32] text-white rounded mt-4 px-4 py-2 hover:bg-[#2c4a24] transition"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border rounded px-3 py-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading || !agree}
              className="w-full bg-[#385C32] text-white rounded px-4 py-2 hover:bg-[#2c4a24] transition"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
