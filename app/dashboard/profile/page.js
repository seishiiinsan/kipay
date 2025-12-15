'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import DashboardHeader from '@/components/DashboardHeader';
import Link from 'next/link';
import UserAvatar from '@/components/Avatar';

const avatarVariants = ['beam', 'marble', 'pixel', 'sunset', 'ring', 'bauhaus'];
const avatarPalettes = {
  default: ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'],
  sunrise: ['#F94144', '#F3722C', '#F8961E', '#F9C74F', '#90BE6D'],
  ocean: ['#001219', '#005F73', '#0A9396', '#94D2BD', '#E9D8A6'],
  candy: ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF'],
};

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const { showToast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarVariant, setAvatarVariant] = useState('beam');
  const [avatarPalette, setAvatarPalette] = useState('default');
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchUser = async () => {
        const res = await fetch(`/api/users/${user.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setName(data.user.name);
          setEmail(data.user.email);
          setAvatarVariant(data.user.avatar_variant || 'beam');
          setAvatarPalette(data.user.avatar_palette || 'default');
        }
      };
      fetchUser();
    }
  }, [user, token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, email, avatar_variant: avatarVariant, avatar_palette: avatarPalette }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Profil mis à jour !', 'success');
        updateUser(data.user);
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        throw new Error(data.error || 'Failed to change password');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white uppercase mb-2 inline-block">← Retour</Link>
          <h1 className="text-5xl font-black text-black dark:text-white uppercase tracking-tighter">Votre Profil</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulaire d'informations */}
          <div className="bg-white dark:bg-black p-8 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex items-center gap-6">
                <UserAvatar name={name} size={80} variant={avatarVariant} palette={avatarPalette} />
                <div>
                  <h2 className="text-2xl font-black text-black dark:text-white uppercase">Informations</h2>
                  <p className="text-gray-500">Modifiez votre nom, email et avatar.</p>
                </div>
              </div>
              
              <div>
                <label className="text-lg font-bold text-black dark:text-white uppercase">Style d&#39;avatar</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {avatarVariants.map(variant => (
                    <button type="button" key={variant} onClick={() => setAvatarVariant(variant)} className={`px-3 py-1 border-2 font-bold uppercase text-sm ${avatarVariant === variant ? 'bg-black text-white' : 'bg-white text-black'}`}>
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-lg font-bold text-black dark:text-white uppercase">Palette de couleurs</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.keys(avatarPalettes).map(paletteName => (
                    <button type="button" key={paletteName} onClick={() => setAvatarPalette(paletteName)} className={`h-8 px-3 border-2 font-bold uppercase text-sm ${avatarPalette === paletteName ? 'ring-2 ring-offset-2 ring-black' : ''}`}>
                      <div className="flex gap-1 h-full items-center">
                        {avatarPalettes[paletteName].map(color => (
                          <div key={color} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="name" className="text-lg font-bold text-black dark:text-white uppercase">Nom</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 block w-full p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
              </div>
              <div>
                <label htmlFor="email" className="text-lg font-bold text-black dark:text-white uppercase">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 block w-full p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
              </div>
              <button type="submit" disabled={profileLoading} className="w-full mt-4 flex items-center justify-center px-8 py-3 border-2 border-black text-lg font-bold text-white bg-black hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase disabled:opacity-50">
                {profileLoading ? 'Sauvegarde...' : 'Mettre à jour'}
              </button>
            </form>
          </div>

          {/* Formulaire de mot de passe */}
          <div className="bg-white dark:bg-black p-8 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <h2 className="text-2xl font-black text-black dark:text-white uppercase mb-6">Sécurité</h2>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="text-lg font-bold text-black dark:text-white uppercase">Mot de passe actuel</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="••••••••" className="mt-2 block w-full p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
              </div>
              <div>
                <label className="text-lg font-bold text-black dark:text-white uppercase">Nouveau mot de passe</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••" className="mt-2 block w-full p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
              </div>
              <button type="submit" disabled={passwordLoading} className="w-full mt-4 flex items-center justify-center px-8 py-3 border-2 border-black text-lg font-bold text-white bg-black hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase disabled:opacity-50">
                {passwordLoading ? 'Modification...' : 'Changer le mot de passe'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
