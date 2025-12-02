'use client'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { QRCodeCanvas } from 'qrcode.react'
import { useRouter } from 'next/navigation'

export default function AdminQRPage() {
  const [businessId, setBusinessId] = useState(null)
  const [scanUrl, setScanUrl] = useState('')
  const router = useRouter()

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/BusinessLoginPage')
        return
      }
      setBusinessId(user.uid)
    })
    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    if (!businessId) return
    const base = window.location.origin
    setScanUrl(`${base}/scan?businessId=${businessId}`)
  }, [businessId])

  if (!businessId) {
    return <div className="p-6 text-center">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <h1 className="text-3xl font-bold mb-4">QR for Customer Onboarding</h1>
      <p className="text-gray-600 mb-6 text-center max-w-sm">
        Print this QR and place it in your shop. When customers scan it, they automatically join your loyalty program.
      </p>

      {scanUrl && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <QRCodeCanvas value={scanUrl} size={260} />
        </div>
      )}

      <div className="mt-8 w-full max-w-lg">
        <p className="text-sm text-gray-500 mb-2">Scan URL</p>
        <input
          value={scanUrl}
          readOnly
          className="w-full p-3 border rounded text-center bg-gray-50"
        />
      </div>

      <p className="text-xs text-gray-400 mt-6 max-w-xs text-center">
        This link is unique to your business ID. Customers will only see your loyalty card.
      </p>
    </div>
  )
}
