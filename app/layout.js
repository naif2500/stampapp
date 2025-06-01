import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import ClientLayout from './components/ClientLayout'

export const metadata = {
  title: 'Stampify',
  description: 'A modern PWA built with Next.js',
  manifest: '/manifest.json',
  themeColor: '#6774CA',
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
