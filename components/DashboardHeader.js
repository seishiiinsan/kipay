'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white dark:bg-black border-b-4 border-black dark:border-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-3xl font-black tracking-tighter text-black dark:text-white uppercase hover:text-indigo-500 transition-colors">
              Kipay
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <Link href="/dashboard/settings" className="hidden md:block text-sm font-bold uppercase text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              Réglages
            </Link>
            <Link href="/dashboard/profile" className="hidden md:block text-sm font-bold uppercase text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              {user?.email}
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 border-2 border-black text-sm font-black text-black bg-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
