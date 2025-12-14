'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import DashboardHeader from '@/components/DashboardHeader';
import Link from 'next/link';

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] ${
      enabled ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
    }`}
  >
    <div
      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-0'
      }`}
    />
  </button>
);

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [prefs, setPrefs] = useState({
    notify_new_expense: true,
    notify_debt_reminder: false,
  });

  useEffect(() => {
    if (user) {
      const fetchUserPrefs = async () => {
        const res = await fetch(`/api/users/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPrefs({
            notify_new_expense: data.user.notify_new_expense,
            notify_debt_reminder: data.user.notify_debt_reminder,
          });
        }
      };
      fetchUserPrefs();
    }
  }, [user, token]);

  const handlePrefChange = async (key, value) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ [key]: value }),
      });

      if (res.ok) {
        showToast('Préférences mises à jour !', 'success');
      } else {
        throw new Error('Failed to update preferences');
      }
    } catch (error) {
      showToast('Erreur lors de la mise à jour', 'error');
      // Revert state on error
      setPrefs(prefs);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white uppercase mb-2 inline-block">← Retour au tableau de bord</Link>
          <h1 className="text-5xl font-black text-black dark:text-white uppercase tracking-tighter">Réglages</h1>
        </div>

        <div className="space-y-12">
          {/* Section Personnalisation */}
          <div className="bg-white dark:bg-black p-8 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h2 className="text-2xl font-black text-black dark:text-white uppercase mb-6">Personnalisation</h2>
            <div>
              <label className="text-lg font-bold text-black dark:text-white uppercase">Thème de l&#39;application</label>
              <p className="text-sm text-gray-500 mb-4">Choisissez comment l&#39;application doit s'afficher.</p>
              <div className="flex gap-4">
                <button onClick={() => setTheme('light')} className={`px-6 py-2 border-2 font-bold uppercase transition-all ${theme === 'light' ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white text-black border-gray-300 hover:border-black'}`}>Clair</button>
                <button onClick={() => setTheme('dark')} className={`px-6 py-2 border-2 font-bold uppercase transition-all ${theme === 'dark' ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white text-black border-gray-300 hover:border-black'}`}>Sombre</button>
                <button onClick={() => setTheme('system')} className={`px-6 py-2 border-2 font-bold uppercase transition-all ${theme === 'system' ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white' : 'bg-white text-black border-gray-300 hover:border-black'}`}>Système</button>
              </div>
            </div>
          </div>

          {/* Section Compte */}
          <div className="bg-white dark:bg-black p-8 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h2 className="text-2xl font-black text-black dark:text-white uppercase mb-6">Compte</h2>
            <Link href="/dashboard/profile" className="inline-block px-6 py-3 border-2 border-black text-lg font-bold text-white bg-black hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase">Modifier mon profil</Link>
            <p className="text-sm text-gray-500 mt-2">Changer votre nom, email ou mot de passe.</p>
          </div>

          {/* Section Notifications */}
          <div className="bg-white dark:bg-black p-8 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h2 className="text-2xl font-black text-black dark:text-white uppercase mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">Nouvelle dépense dans un groupe</p>
                  <p className="text-sm text-gray-500">Recevoir un email quand un membre ajoute une dépense.</p>
                </div>
                <Toggle enabled={prefs.notify_new_expense} onChange={() => handlePrefChange('notify_new_expense', !prefs.notify_new_expense)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">Rappel de remboursement</p>
                  <p className="text-sm text-gray-500">Recevoir un rappel hebdomadaire si vous avez des dettes.</p>
                </div>
                <Toggle enabled={prefs.notify_debt_reminder} onChange={() => handlePrefChange('notify_debt_reminder', !prefs.notify_debt_reminder)} />
              </div>
            </div>
          </div>

          {/* Zone de danger */}
          <div className="border-t-4 border-black dark:border-white pt-8 mt-12">
            <h3 className="text-xl font-black text-red-600 uppercase mb-4">Zone de danger</h3>
            <button className="px-6 py-3 border-2 border-red-600 text-lg font-bold text-red-600 bg-white hover:bg-red-600 hover:text-white transition-all uppercase">Supprimer mon compte</button>
            <p className="text-sm text-gray-500 mt-2 font-medium">Attention : Cette action est irréversible et supprimera toutes vos données.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
