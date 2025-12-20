'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { auth, storage } from '@/lib/firebase'

export default function BusinessSignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteId = searchParams.get('invite')

  const [step, setStep] = useState(1)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [postcode, setPostcode] = useState('')
  const [logo, setLogo] = useState(null)

  const [cardName, setCardName] = useState('')
  const [stampsNeeded, setStampsNeeded] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!inviteId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Invalid or missing invite link</p>
      </div>
    )
  }

  const handleNext = (e) => {
    e.preventDefault()

    if (!email || !password || !name) {
      setError('Please fill in required fields')
      return
    }

    setError('')
    setStep(2)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      let logoUrl = ''

      if (logo) {
        const logoRef = ref(storage, `businessLogos/${user.uid}`)
        await uploadBytes(logoRef, logo)
        logoUrl = await getDownloadURL(logoRef)
      }

      const functions = getFunctions(undefined, 'europe-north1')
      const createBusiness = httpsCallable(
        functions,
        'createBusinessFromInvite'
      )

      await createBusiness({
        inviteId,
        name,
        city,
        postcode,
        logoUrl,
        cardName,
        stampsNeeded: Number(stampsNeeded),
      })

      router.push('/admin')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={step === 1 ? handleNext : handleSignup}
        className="bg-white p-8 rounded-xl shadow-md max-w-sm w-full space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">
          {step === 1 ? 'Business Info' : 'Stamp Card'}
        </h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {step === 1 && (
          <>
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
              placeholder="Business name"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setLogo(e.target.files?.[0] || null)}
            />

            <button
              type="submit"
              className="w-full bg-[#385C32] text-white rounded px-4 py-2 hover:bg-[#2f4c29]"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Card name (e.g. Espresso)"
              className="w-full border rounded px-3 py-2"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Stamps needed (e.g. 9)"
              className="w-full border rounded px-3 py-2"
              value={stampsNeeded}
              onChange={(e) => setStampsNeeded(e.target.value)}
              required
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/2 bg-gray-300 text-gray-700 rounded px-4 py-2"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-1/2 bg-[#385C32] text-white rounded px-4 py-2"
              >
                {loading ? 'Creating…' : 'Create'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
