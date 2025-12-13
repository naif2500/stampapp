'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import {
  collection,
  getDocs,
  onSnapshot
} from 'firebase/firestore'

export default function AdminDashboard() {
  const [businesses, setBusinesses] = useState([])
  const [customersByBusiness, setCustomersByBusiness] = useState({})
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [stampEvents, setStampEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubBiz = onSnapshot(collection(db, 'businesses'), async snap => {
      const list = []
      const customerMap = {}
      let customerCount = 0

      for (const docSnap of snap.docs) {
        const biz = { id: docSnap.id, ...docSnap.data() }
        list.push(biz)

        const custSnap = await getDocs(collection(db, `businesses/${docSnap.id}/customers`))
        const count = custSnap.size
        customerMap[docSnap.id] = count
        customerCount += count
      }

      setBusinesses(list)
      setCustomersByBusiness(customerMap)
      setTotalCustomers(customerCount)
      setLoading(false)
    })

    const unsubActivity = onSnapshot(collection(db, 'globalActivity'), snap => {
      const events = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setStampEvents(events.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds))
    })

    return () => {
      unsubBiz()
      unsubActivity()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  const totalBusinesses = businesses.length
  const totalStamps = stampEvents.filter(e => e.type === 'stamp').length
  const totalRedeems = stampEvents.filter(e => e.type === 'redeem').length

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Local Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white rounded-xl shadow">
          <div className="text-2xl font-bold">{totalBusinesses}</div>
          <div className="text-gray-500">Businesses</div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <div className="text-gray-500">Total customers</div>
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <div className="text-2xl font-bold">{totalStamps}</div>
          <div className="text-gray-500">Total stamps given</div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Businesses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {businesses.map(biz => (
          <div key={biz.id} className="p-6 bg-white rounded-xl shadow">
            <div className="font-semibold text-lg mb-1">{biz.name}</div>
            <div className="text-gray-600 mb-2">Card: {biz.cardName}</div>
            <div className="text-sm text-gray-800">
              Customers: {customersByBusiness[biz.id] || 0}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Activity stream</h2>
      <div className="bg-white rounded-xl shadow divide-y">
        {stampEvents.slice(0, 30).map(event => (
          <div key={event.id} className="p-4 flex justify-between">
            <div>
              <div className="font-medium">
                {event.type === 'stamp' ? 'Stamp added' : 'Redeemed'}
              </div>
              <div className="text-gray-600 text-sm">
                Business: {event.businessId}
              </div>
            </div>
            <div className="text-gray-500 text-sm">
              {new Date(event.timestamp?.seconds * 1000).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
