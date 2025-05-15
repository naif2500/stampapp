'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function BusinessSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cardName, setCardName] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stampsNeeded, setStampsNeeded] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'businesses', user.uid), {
        email,
        createdAt: new Date(),
        cardName,
        name,
        price: parseFloat(price),
        stampsNeeded: parseInt(stampsNeeded),
        type,
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
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Business Sign Up</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="text" placeholder="Business Name" className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        <input type="text" placeholder="Card Name" className="w-full border rounded px-3 py-2" value={cardName} onChange={(e) => setCardName(e.target.value)} />
        <input type="number" placeholder="Price" className="w-full border rounded px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="number" placeholder="Stamps Needed" className="w-full border rounded px-3 py-2" value={stampsNeeded} onChange={(e) => setStampsNeeded(e.target.value)} />
        <input type="text" placeholder="Card Type" className="w-full border rounded px-3 py-2" value={type} onChange={(e) => setType(e.target.value)} />

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition">
          {loading ? 'Signing up...' : 'Create Business Account'}
        </button>
      </form>
    </div>
  );
}
