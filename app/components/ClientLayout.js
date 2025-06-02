'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

export default function ClientLayout({ children }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/' 

  return (
    <>
      {!isHomePage && <Navbar />}
      <main>{children}</main>
    </>
  )
}
