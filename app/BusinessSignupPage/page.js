'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase'; // make sure you export storage from firebase.js

export default function BusinessSignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [logo, setLogo] = useState(null);

  const [cardName, setCardName] = useState('');
  const [price, setPrice] = useState('');
  const [stampsNeeded, setStampsNeeded] = useState('');
  const [type, setType] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !city || !postcode) {
      setError('Please fill in all business info fields.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload logo if provided
      let logoUrl = '';
      if (logo) {
        const logoRef = ref(storage, `businessLogos/${user.uid}/${logo.name}`);
        await uploadBytes(logoRef, logo);
        logoUrl = await getDownloadURL(logoRef);
      }

      // Save business data
      await setDoc(doc(db, 'businesses', user.uid), {
        email,
        name,
        city,
        postcode,
        logoUrl,
        cardName,
        price: parseFloat(price),
        stampsNeeded: parseInt(stampsNeeded),
        type,
        createdAt: new Date(),
      });

      router.push('/admin');
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
        onSubmit={step === 1 ? handleNext : handleSignup}
        className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">
          {step === 1 ? 'Business Info' : 'Card Info'}
        </h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Business Name"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <input
              type="text"
              placeholder="City"
              className="w-full border rounded px-3 py-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Postcode"
              className="w-full border rounded px-3 py-2"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="w-full border rounded px-3 py-2"
              onChange={handleLogoChange}
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Card Name"
              className="w-full border rounded px-3 py-2"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full border rounded px-3 py-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Stamps Needed"
              className="w-full border rounded px-3 py-2"
              value={stampsNeeded}
              onChange={(e) => setStampsNeeded(e.target.value)}
            />
            <input
              type="text"
              placeholder="Card Type"
              className="w-full border rounded px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/2 bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
              >
                {loading ? 'Creating...' : 'Submit'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
