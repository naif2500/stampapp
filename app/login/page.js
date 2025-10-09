'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, setPersistence, browserLocalPersistence,indexedDBLocalPersistence, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [error, setError] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  

  const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    const container = document.getElementById('recaptcha-container');

    // Reset the container’s visibility safely
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';

    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
  }

  return window.recaptchaVerifier;
};


  const sendOtp = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {

    const auth = getAuth();

// Set persistence once, before login
await setPersistence(auth, indexedDBLocalPersistence);

    const appVerifier = setupRecaptcha();

    // Automatically add +45 if not already included
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+45' + formattedPhone;
    }

    const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
    setConfirmationResult(confirmation);
  } catch (err) {
    console.error(err);
    setError(err.message || 'Failed to send OTP');
  } finally {
    setLoading(false);
  }
};

const handleOtpChange = (element, index) => {
  if (isNaN(element.value)) return; // only numbers

  const newOtp = [...otp];
  newOtp[index] = element.value;
  setOtp(newOtp);

  // Move focus to next input
  if (element.nextSibling && element.value !== '') {
    element.nextSibling.focus();
  }
};


  const verifyOtp = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const otpCode = otp.join(''); // combine all 6 digits

  try {
    await confirmationResult.confirm(otpCode);
    router.push('/costumer'); // dashboard
  } catch (err) {
    console.error(err);
    setError(err.message || 'Invalid OTP');
  } finally {
    setLoading(false);
  }
};

const resendOtp = async () => {
  setError('');
  setLoading(true);

  try {
    const auth = getAuth();
    await setPersistence(auth, indexedDBLocalPersistence);
    const appVerifier = setupRecaptcha();

    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+45' + formattedPhone;
    }

    const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
    setConfirmationResult(confirmation);
    setOtp(new Array(6).fill('')); // clear previous OTP inputs
  } catch (err) {
    console.error(err);
    setError(err.message || 'Failed to resend OTP');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col max-w-sm mx-auto mt-20 p-6 bg-white rounded-lg">
       

      {!confirmationResult ? (
        <form onSubmit={sendOtp} className="flex flex-col gap-4">
          <img
        src="/Green_elephant.png"
        alt="Elephant"
        className="w-14 h-14 mb-6 mx-auto"
      />
          <h2 className="text-2xl text-center font-bold text-black mb-2">Velkommen</h2>
          <p className="text-black text-center mb-8">
            Log ind med dit telefonnummer
          </p>
          <input
            type="tel"
            placeholder="Telefonnummer"
            className="p-2 border rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <div id="recaptcha-container"></div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#385C32] text-white py-2 rounded"
          >
            {loading ? 'Sender kode...' : 'Send kode'}
          </button>
          <p className="text-center text-sm mt-2 text-gray-600">
            Har du ikke en konto?{' '}
            <a href="/signup" className="text-[#385C32] font-semibold underline">
              Opret bruger
            </a>
          </p>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="flex flex-col gap-4">
    {/* ✅ Message above OTP inputs */}
    <p className="text-center text-gray-700 mb-2 font-bold">
      Vi har sendt dig en SMS
    </p>
    <p className="text-center text-gray-500 mb-4 text-sm">
      Indtast koden sendt til <span className="font-semibold">{phone}</span>
    </p>

    {/* ✅ 6-digit OTP input */}
    <div className="flex justify-between gap-2">
      {otp.map((data, index) => (
        <input
          key={index}
          type="tel"           
          inputMode="numeric"  
          pattern="[0-9]*"     
          maxLength="1"
          value={data}
          onChange={(e) => handleOtpChange(e.target, index)}
          className="w-12 h-12 text-center border rounded text-lg"
        />
      ))}
    </div>

    {error && <p className="text-red-500 text-sm">{error}</p>}

    <button
      type="submit"
      disabled={loading}
      className="bg-[#385C32] text-white py-2 rounded"
    >
      {loading ? 'Bekræfter...' : 'Bekræft kode'}
    </button>

    <p className="text-center text-sm mt-2 text-gray-600">
      Har du ikke modtaget koden?{' '}
      <button
        type="button"
        onClick={resendOtp}
        className="text-[#385C32] font-semibold underline"
      >
        Send igen
      </button>
    </p>
  </form>

      )}
    </div>
  );
}
