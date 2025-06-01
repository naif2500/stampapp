"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { usePathname } from 'next/navigation'; // Use usePathname from next/navigation

export const metadata = {
  title: 'Stampify',
  description: 'A modern PWA built with Next.js',
  manifest: '/manifest.json',
  themeColor: '#6774CA', 
}


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current pathname
  const isHomePage = pathname === "/"; // Check if it's the homepage
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!isHomePage && <Navbar />}
        <main  >{children}</main>
      </body>
    </html>
  );
}
