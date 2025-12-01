import './globals.css'
import { Geist, Geist_Mono, Unbounded } from 'next/font/google'
import AuthInit from './AuthInit'


export const metadata = {
  title: 'Stampify',
  description: 'A modern PWA built with Next.js',
  manifest: '/manifest.json'
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const unbounded = Unbounded({
  variable: '--font-unbounded',
  subsets: ['latin'],
  weight: ['400', '700'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} bg-[#F8FFFA] antialiased`}>
        <AuthInit />
       {children}
      </body>
    </html>
  )
}
