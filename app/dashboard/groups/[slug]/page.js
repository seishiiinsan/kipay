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
import { motion } from 'framer-motion';

const categoryIcons = {
  'Alimentation': '🍔',
  'Transport': '🚗',
  'Logement': '🏠',
  'Loisirs': '🎉',
  'Autre': '🛒',
};

export default function GroupDetailPage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const groupSlug = params.slug;
  
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchData = useCallback(async (groupId) => {
    if (!token || !groupId) return;
    try {
      // On récupère TOUT : détails du groupe (membres/soldes), dépenses, stats
      const [groupRes, expensesRes, statsRes] = await Promise.all([
        fetch(`/api/groups/${groupId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/groups/${groupId}/expenses`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/groups/${groupId}/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (groupRes.ok) setGroup((await groupRes.json()).group);
      if (expensesRes.ok) setExpenses((await expensesRes.json()).expenses);
      if (statsRes.ok) setStats((await statsRes.json()).stats);

    } catch (error) {
      console.error("Fetch error:", error);
      setToast({ message: "Erreur lors du chargement des données.", type: "error" });
    }
  }, [token]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!groupSlug || !token) {
      setLoading(false);
      return;
    }

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // 1. Récupérer l'ID du groupe via le slug
        const codeRes = await fetch(`/api/groups/by-code/${groupSlug}`, { headers: { 'Authorization': `Bearer ${token}` } });
        
        if (!codeRes.ok) {
          if (codeRes.status === 404) throw new Error('Groupe introuvable');
          throw new Error('Erreur serveur');
        }
        
        const codeData = await codeRes.json();
        const groupId = codeData.group.id;

        // 2. Récupérer toutes les données avec l'ID
        await fetchData(groupId);
      } catch (error) {
        console.error("Error loading group:", error);
        setToast({ message: error.message, type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token, groupSlug, isAuthenticated, authLoading, router, fetchData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(group.invite_code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setToast({ message: "Code copié !", type: "success" });
    });
  };

  const handleExpenseAdded = () => {
    if (group) fetchData(group.id);
    setToast({ message: "Dépense ajoutée avec succès", type: "success" });
  };

  const handleDeleteGroup = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setToast({ message: data.error || "Une erreur est survenue.", type: "error" });
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      setToast({ message: "Impossible de supprimer le groupe.", type: "error" });
      setIsDeleteModalOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (authLoading || loading) return <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-black dark:text-white font-black text-2xl uppercase">Chargement...</div>;
  if (!group) return <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-black dark:text-white font-black text-2xl uppercase">Groupe introuvable</div>;

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

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
            <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-2 flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <span className="text-sm font-bold uppercase">Code:</span>
              <span className="text-lg font-black tracking-widest">{group.invite_code}</span>
              <button onClick={copyToClipboard} className="text-sm font-bold p-1 border-2 border-black bg-gray-200 hover:bg-gray-300">{copied ? 'Copié!' : 'Copier'}</button>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsSettleModalOpen(true)} className="px-6 py-3 border-2 border-black text-lg font-black text-black bg-white hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase">Équilibrer</button>
              <button onClick={() => setIsAddExpenseModalOpen(true)} className="px-6 py-3 border-2 border-black text-lg font-black text-white bg-black hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase">+ Dépense</button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
              <div className="p-6 border-b-4 border-black dark:border-white bg-gray-100 dark:bg-gray-800 flex justify-between items-center">
                <h2 className="text-2xl font-black text-black dark:text-white uppercase">Dépenses</h2>
                <span className="font-bold text-gray-500 uppercase">{expenses.length} dépenses</span>
              </div>
              <motion.div variants={listVariants} initial="hidden" animate="visible" className="divide-y-2 divide-black dark:divide-white">
                {expenses.map(expense => (
                  <motion.div variants={itemVariants} key={expense.id} className="p-6 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white dark:bg-black border-2 border-black dark:border-white flex items-center justify-center text-2xl">{categoryIcons[expense.category] || '🛒'}</div>
                      <div>
                        <h3 className="text-xl font-bold text-black dark:text-white uppercase">{expense.description}</h3>
                        <p className="text-sm font-medium text-gray-500 uppercase">Payé par <span className="text-black dark:text-white font-bold">{expense.paid_by_name}</span> • {new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-2xl font-black text-black dark:text-white">{parseFloat(expense.amount).toFixed(2)} €</p>
                  </motion.div>
                ))}
                {expenses.length === 0 && <div className="p-12 text-center"><p className="text-xl font-bold text-gray-400 uppercase">Aucune dépense.</p></div>}
              </motion.div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-white dark:bg-black p-6 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h2 className="text-2xl font-black text-black dark:text-white uppercase mb-4">Membres</h2>
              <div className="space-y-3">
                {group && group.members && group.members.map(member => (
                  <div key={member.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-2 border-2 border-black dark:border-white">
                    <p className="font-bold text-lg">{member.name}</p>
                    <p className={`text-lg font-black ${member.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>{member.balance >= 0 ? '+' : ''}{member.balance.toFixed(2)} €</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-black p-6 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h2 className="text-2xl font-black text-black dark:text-white uppercase mb-4">Stats par Catégorie</h2>
              <div className="space-y-3">
                {stats && stats.totalByCategory.map(cat => (
                  <div key={cat.category} className="flex justify-between items-center">
                    <p className="font-bold text-lg flex items-center gap-2">{categoryIcons[cat.category] || '🛒'} {cat.category}</p>
                    <p className="text-lg font-black">{parseFloat(cat.total_amount).toFixed(2)} €</p>
                  </div>
                ))}
                {stats && stats.totalByCategory.length === 0 && <p className="text-gray-500">Aucune dépense.</p>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t-4 border-black dark:border-white pt-8 mt-12">
          <h3 className="text-xl font-black text-red-600 uppercase mb-4">Zone de danger</h3>
          <button onClick={() => setIsDeleteModalOpen(true)} className="px-6 py-3 border-2 border-red-600 text-lg font-bold text-red-600 bg-white hover:bg-red-600 hover:text-white transition-all uppercase">Supprimer le groupe</button>
        </div>
      </main>

      <Modal isOpen={isAddExpenseModalOpen} onClose={() => setIsAddExpenseModalOpen(false)} title="Ajouter une dépense">
        <AddExpenseForm group={group} onClose={() => setIsAddExpenseModalOpen(false)} onExpenseAdded={handleExpenseAdded} />
      </Modal>
      {isSettleModalOpen && <Modal isOpen={isSettleModalOpen} onClose={() => setIsSettleModalOpen(false)} title="Équilibrer les comptes"><SettleDebtModal group={group} onClose={() => setIsSettleModalOpen(false)} onPaymentMade={fetchData} /></Modal>}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Supprimer le groupe">
        <div className="space-y-6">
          <div className="bg-red-50 border-2 border-red-500 p-4"><p className="text-red-600 font-bold text-lg uppercase">Attention !</p><p className="text-red-800 mt-2">Vous êtes sur le point de supprimer définitivement le groupe <span className="font-black">{group.name}</span>.</p></div>
          <p className="font-bold">Cette action est irréversible. Êtes-vous sûr ?</p>
          <div className="flex gap-4">
            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 border-2 border-black text-lg font-bold text-black bg-white hover:bg-gray-100 transition-all uppercase">Annuler</button>
            <button onClick={handleDeleteGroup} disabled={deleteLoading} className="flex-1 py-3 border-2 border-red-600 text-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-all uppercase disabled:opacity-50">{deleteLoading ? 'Suppression...' : 'Confirmer'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
