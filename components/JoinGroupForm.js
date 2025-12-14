'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

export default function JoinGroupForm({ onClose }) {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/groups/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          invite_code: inviteCode,
          user_id: user.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to join group');
      }

      const data = await res.json();
      showToast('Vous avez rejoint le groupe !', 'success');
      onClose();
      router.push(`/dashboard/groups/${data.group_id}`);
    } catch (err) {
      setError(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="inviteCode" className="text-lg font-bold text-black dark:text-white uppercase">Code d&#39;invitation</label>
        <input
          type="text"
          id="inviteCode"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          required
          maxLength="6"
          className="mt-2 block w-full p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-center tracking-[.5em]"
          placeholder="XXXXXX"
        />
      </div>

      {error && <p className="text-red-500 font-bold text-center bg-red-50 p-3 border-2 border-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 flex items-center justify-center px-8 py-4 border-2 border-black text-xl font-black text-white bg-black hover:bg-indigo-600 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] dark:border-white dark:bg-white dark:text-black dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
      >
        {loading ? 'Recherche...' : 'Rejoindre le groupe'}
      </button>
    </form>
  );
}
