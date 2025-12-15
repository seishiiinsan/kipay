'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('code');
  
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      // Si pas connecté, on redirige vers le login en gardant le code
      router.push(`/login?inviteCode=${inviteCode}`);
      return;
    }

    const fetchGroupPreview = async () => {
      try {
        const res = await fetch(`/api/groups/preview?code=${inviteCode}`);
        if (!res.ok) throw new Error('Groupe introuvable');
        const data = await res.json();
        setGroup(data.group);
      } catch (error) {
        showToast(error.message, 'error');
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (inviteCode) {
      fetchGroupPreview();
    } else {
      router.push('/dashboard'); // Pas de code, pas de raison d'être ici
    }
  }, [inviteCode, isAuthenticated, authLoading, router, showToast]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await fetch('/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ invite_code: inviteCode, user_id: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Impossible de rejoindre le groupe');
      
      showToast(`Bienvenue dans ${group.name} !`, 'success');
      router.push(`/dashboard/groups/${data.group_id}`);
    } catch (error) {
      showToast(error.message, 'error');
      setJoining(false);
    }
  };

  if (loading || authLoading) {
    return <div className="text-xl font-bold">Chargement de l'invitation...</div>;
  }

  if (!group) return null;

  return (
    <div className="max-w-md w-full text-center bg-white dark:bg-black border-4 border-black dark:border-white p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
      <h1 className="text-2xl font-black text-black dark:text-white uppercase">Rejoindre un groupe</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        Vous avez été invité à rejoindre le groupe :
      </p>
      <p className="my-4 text-4xl font-black text-indigo-500">{group.name}</p>
      
      <button 
        onClick={handleJoin}
        disabled={joining}
        className="w-full px-6 py-3 border-2 border-black text-lg font-bold text-white bg-black hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase disabled:opacity-50"
      >
        {joining ? 'Adhésion...' : 'Confirmer et rejoindre'}
      </button>
      <Link href="/dashboard" className="mt-4 inline-block text-sm font-bold text-gray-500 hover:underline">
        Annuler
      </Link>
    </div>
  );
}

export default function JoinPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-xl font-bold">Chargement...</div>}>
        <JoinContent />
      </Suspense>
    </div>
  );
}
