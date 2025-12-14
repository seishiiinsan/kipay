'use client';

import { useTheme } from 'next-themes';
import DashboardHeader from '@/components/DashboardHeader';
import Link from 'next/link';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white uppercase mb-2 inline-block">← Retour au tableau de bord</Link>
          <h1 className="text-5xl font-black text-black dark:text-white uppercase tracking-tighter">Réglages</h1>
        </div>

        <div className="bg-white dark:bg-black p-8 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] max-w-2xl">
          <h2 className="text-2xl font-black text-black dark:text-white uppercase mb-6">Personnalisation</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-lg font-bold text-black dark:text-white uppercase">Thème de l&#39;application</label>
              <p className="text-sm text-gray-500 mb-4">Choisissez comment l&#39;application doit s&#39;afficher.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setTheme('light')}
                  className={`px-6 py-2 border-2 font-bold uppercase transition-all ${theme === 'light' ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                >
                  Clair
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`px-6 py-2 border-2 font-bold uppercase transition-all ${theme === 'dark' ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                >
                  Sombre
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`px-6 py-2 border-2 font-bold uppercase transition-all ${theme === 'system' ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                >
                  Système
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
