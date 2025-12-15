'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import UserAvatar from './Avatar';

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
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard/profile" className="hidden md:flex items-center gap-3 text-sm font-bold uppercase text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              <UserAvatar name={user?.email} size={32} variant={user?.avatar_variant} palette={user?.avatar_palette} />
              <span>{user?.email}</span>
            </Link>
            
            <button
              onClick={logout}
              className="hidden md:block px-4 py-2 border-2 border-black text-sm font-black text-black bg-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase"
            >
              Déconnexion
            </button>

            <Link href="/dashboard/settings" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" aria-label="Réglages">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-black dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
