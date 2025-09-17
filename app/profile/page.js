'use client';

import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  Settings,
  FileText,
  Trash2,
  HelpCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import CustomerNavbar from '../components/CustomerNavbar';

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  const menuItems = [
    {
      label: 'Indstillinger',
      icon: <Settings className="w-6 h-6 text-gray-600" />,
      action: () => router.push('/account-info'),
      external: false,
    },
    {
      label: 'Privatlivspolitik',
      icon: <FileText className="w-6 h-6 text-gray-600" />,
      action: () => window.open('https://your-privacy-link.com', '_blank'),
      external: true,
    },
    {
      label: 'Slet konto',
      icon: <Trash2 className="w-6 h-6 text-gray-600" />,
      action: () => alert('Implement delete account flow'),
      external: false,
    },
    {
      label: 'Hjælp',
      icon: <HelpCircle className="w-6 h-6 text-gray-600" />,
      action: () => router.push('/help'),
      external: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      <CustomerNavbar />
      <main className="flex-1 flex flex-col">
        <header className="p-6 bg-white ">
          <h1 className="text-4xl font-bold">Din konto</h1>
        </header>

        <div className="flex-1 p-4">
          <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span className="text-lg text-gray-800 font-medium">{item.label}</span>
                </div>
                {item.external ? (
                  <ExternalLink className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronRight className="w-6 h-6 text-gray-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full max-w-xs mx-auto block py-3 bg-[#6774CA] text-white font-medium rounded-full hover:bg-[#5a6eab] transition"
          >
            Log ud
          </button>
        </div>
      </main>
    </div>
  );
}
