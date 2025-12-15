'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Link from 'next/link';
import Modal from '@/components/Modal';
import AddExpenseForm from '@/components/AddExpenseForm';
import SettleDebtModal from '@/components/SettleDebtModal';
import Toast from '@/components/Toast';
import QRCode from 'react-qr-code';

const categoryIcons = {
  'Alimentation': '🍔', 'Transport': '🚗', 'Logement': '🏠', 'Loisirs': '🎉', 'Autre': '🛒',
};

export default function GroupDetailPage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const groupId = params.id;
  
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const inviteLink = group ? `${window.location.origin}/join?code=${group.invite_code}` : '';

  const fetchData = useCallback(async () => {
    if (!token || !groupId) return;
    try {
      setLoading(true);
      const [groupRes, expensesRes, statsRes] = await Promise.all([
        fetch(`/api/groups/${groupId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/groups/${groupId}/expenses`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/groups/${groupId}/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (groupRes.ok) setGroup((await groupRes.json()).group);
      if (expensesRes.ok) setExpenses((await expensesRes.json()).expenses);
      if (statsRes.ok) setStats((await statsRes.json()).stats);
    } catch (error) {
      setToast({ message: "Erreur lors du chargement des données", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [token, groupId]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/login');
    else fetchData();
  }, [token, isAuthenticated, authLoading, router, fetchData]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast({ message: "Lien copié !", type: "success" });
    });
  };

  if (authLoading || loading) return <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-black dark:text-white font-black text-2xl uppercase">Chargement...</div>;
  if (!group) return <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-black dark:text-white font-black text-2xl uppercase">Groupe introuvable</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-black dark:hover:text-white uppercase mb-2 inline-block">← Retour</Link>
            <h1 className="text-5xl font-black text-black dark:text-white uppercase tracking-tighter">{group.name}</h1>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <button onClick={() => setIsInviteModalOpen(true)} className="px-4 py-2 border-2 border-black bg-white text-black font-bold uppercase flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.5 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              Inviter
            </button>
            <div className="flex gap-4">
              <button onClick={() => setIsSettleModalOpen(true)} className="px-6 py-3 border-2 border-black text-lg font-black text-black bg-white hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase">Équilibrer</button>
              <button onClick={() => setIsAddExpenseModalOpen(true)} className="px-6 py-3 border-2 border-black text-lg font-black text-white bg-black hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase">+ Dépense</button>
            </div>
          </div>
        </div>

        {/* ... (le reste de la page) ... */}
        
      </main>

      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Inviter des membres">
        <div className="text-center space-y-6">
          <p className="font-medium text-gray-600">Partagez ce QR Code ou le lien ci-dessous pour inviter des amis dans le groupe <span className="font-bold">{group.name}</span>.</p>
          <div className="bg-white p-4 border-2 border-black inline-block">
            <QRCode value={inviteLink} size={200} />
          </div>
          <div className="flex items-center border-2 border-black bg-gray-100">
            <input type="text" readOnly value={inviteLink} className="p-3 bg-transparent flex-grow text-sm font-mono"/>
            <button onClick={() => copyToClipboard(inviteLink)} className="p-3 bg-black text-white font-bold uppercase">Copier</button>
          </div>
        </div>
      </Modal>
      
      {/* ... (les autres modales) ... */}
    </div>
  );
}
