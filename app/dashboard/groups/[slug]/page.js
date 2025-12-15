'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Link from 'next/link';
import Modal from '@/components/Modal';
import AddExpenseForm from '@/components/AddExpenseForm';
import EditExpenseForm from '@/components/EditExpenseForm';
import SettleDebtModal from '@/components/SettleDebtModal';
import Toast from '@/components/Toast';
import { motion } from 'framer-motion';
import UserAvatar from '@/components/Avatar';

const categoryIcons = {
  'Alimentation': '🍔',
  'Transport': '🚗',
  'Logement': '🏠',
  'Loisirs': '🎉',
  'Autre': '🛒',
};

const ActivityItem = ({ activity }) => {
  const { user_name, type, details, created_at, avatar_variant, avatar_palette } = activity;
  const time = new Date(created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const formatAmount = (amount) => {
    const val = parseFloat(amount);
    return isNaN(val) ? '0.00' : val.toFixed(2);
  };

  let icon = '📝';
  let content = null;

  switch (type) {
    case 'EXPENSE_CREATE':
      icon = '💸';
      content = (
        <>
          a payé <span className="font-black text-black dark:text-white">{formatAmount(details.amount)}€</span> pour <span className="italic">&#34;{details.description}&#34;</span>
        </>
      );
      break;
    case 'EXPENSE_UPDATE':
      icon = '✏️';
      content = (
        <>
          a modifié la dépense <span className="italic">&#34;{details.description}&#34;</span>
        </>
      );
      break;
    case 'EXPENSE_DELETE':
      icon = '🗑️';
      content = (
        <>
          a supprimé la dépense <span className="italic">&#34;{details.description}&#34;</span>
        </>
      );
      break;
    case 'MEMBER_JOIN':
      icon = '👋';
      content = 'a rejoint le groupe !';
      break;
    case 'PAYMENT':
      icon = '🤝';
      content = (
        <>
          a remboursé <span className="font-black text-green-600">{formatAmount(details.amount)}€</span>
        </>
      );
      break;
    default:
      content = 'a fait une action';
  }

  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-200 dark:border-gray-800 last:border-0">
      <UserAvatar name={user_name} size={32} variant={avatar_variant} palette={avatar_palette} />
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-bold text-black dark:text-white uppercase">{user_name || 'Quelqu\'un'}</span> {content}
        </p>
        <p className="text-xs text-gray-400 mt-1 font-medium">{time}</p>
      </div>
    </div>
  );
};

export default function GroupDetailPage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const groupSlug = params.slug;
  
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modales
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteExpenseModalOpen, setIsDeleteExpenseModalOpen] = useState(false);
  
  const [copied, setCopied] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchData = useCallback(async (groupId) => {
    if (!token || !groupId) return;
    try {
      const [groupRes, expensesRes, statsRes, activityRes] = await Promise.all([
        fetch(`/api/groups/${groupId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/groups/${groupId}/expenses`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/groups/${groupId}/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/groups/${groupId}/activity`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (groupRes.ok) setGroup((await groupRes.json()).group);
      if (expensesRes.ok) setExpenses((await expensesRes.json()).expenses);
      if (statsRes.ok) setStats((await statsRes.json()).stats);
      if (activityRes.ok) setActivities((await activityRes.json()).activities);

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
        const codeRes = await fetch(`/api/groups/by-code/${groupSlug}`, { headers: { 'Authorization': `Bearer ${token}` } });
        
        if (!codeRes.ok) {
          if (codeRes.status === 404) throw new Error('Groupe introuvable');
          throw new Error('Erreur serveur');
        }
        
        const codeData = await codeRes.json();
        const groupId = codeData.group.id;

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

  const handleExpenseUpdated = () => {
    if (group) fetchData(group.id);
    setToast({ message: "Dépense modifiée avec succès", type: "success" });
  };

  const handleDeleteExpense = async () => {
    if (!selectedExpense) return;
    try {
      const res = await fetch(`/api/expenses/${selectedExpense.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setToast({ message: "Dépense supprimée", type: "success" });
        fetchData(group.id);
        setIsDeleteExpenseModalOpen(false);
        setSelectedExpense(null);
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      setToast({ message: error.message, type: "error" });
    }
  };

  const openEditModal = (expense) => {
    setSelectedExpense(expense);
    setIsEditExpenseModalOpen(true);
  };

  const openDeleteExpenseModal = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteExpenseModalOpen(true);
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
        {/* Header du Groupe */}
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
          {/* Colonne Dépenses */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
              <div className="p-6 border-b-4 border-black dark:border-white bg-gray-100 dark:bg-gray-800 flex justify-between items-center">
                <h2 className="text-2xl font-black text-black dark:text-white uppercase">Dépenses</h2>
                <span className="font-bold text-gray-500 uppercase">{expenses.length} dépenses</span>
              </div>
              <motion.div key={expenses.length} variants={listVariants} initial="hidden" animate="visible" className="divide-y-2 divide-black dark:divide-white">
                {expenses.map(expense => (
                  <motion.div 
                    variants={itemVariants} 
                    key={expense.id} 
                    className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group/expense"
                  >
                    {/* Partie Gauche : Icône + Description */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-12 w-12 bg-white dark:bg-black border-2 border-black dark:border-white flex items-center justify-center text-2xl shrink-0">
                        {categoryIcons[expense.category] || '🛒'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-black dark:text-white uppercase truncate">{expense.description}</h3>
                        <p className="text-sm font-medium text-gray-500 uppercase truncate">Payé par <span className="text-black dark:text-white font-bold">{expense.paid_by_name}</span> • {new Date(expense.date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Partie Droite : Prix + Actions (Overlay) */}
                    <div className="relative flex items-center justify-end h-10">
                      {/* Prix */}
                      <p className={`text-2xl font-black text-black dark:text-white whitespace-nowrap transition-opacity duration-200 ${user && String(expense.paid_by_user_id) === String(user.id) ? 'group-hover/expense:opacity-0' : ''}`}>
                        {parseFloat(expense.amount).toFixed(2)} €
                      </p>
                      
                      {/* Actions */}
                      {user && String(expense.paid_by_user_id) === String(user.id) && (
                        <div className="absolute right-0 flex gap-2 opacity-0 group-hover/expense:opacity-100 transition-opacity duration-200 pointer-events-none group-hover/expense:pointer-events-auto">
                          <button onClick={() => openEditModal(expense)} className="p-2 border-2 border-black bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" title="Modifier">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>
                          </button>
                          <button onClick={() => openDeleteExpenseModal(expense)} className="p-2 border-2 border-black bg-red-500 text-white hover:bg-red-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" title="Supprimer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {expenses.length === 0 && <div className="p-12 text-center"><p className="text-xl font-bold text-gray-400 uppercase">Aucune dépense.</p></div>}
              </motion.div>
            </div>
          </div>

          {/* Colonne Latérale (Membres & Stats & Activité) */}
          <div className="space-y-8">
            {/* Membres */}
            <div className="bg-white dark:bg-black p-6 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h2 className="text-2xl font-black text-black dark:text-white uppercase mb-4">Membres</h2>
              <div className="space-y-3">
                {group && group.members && group.members.map(member => (
                  <div key={member.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-2 border-2 border-black dark:border-white">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={member.name} size={32} variant={member.avatar_variant} palette={member.avatar_palette} />
                      <p className="font-bold text-lg">{member.name}</p>
                    </div>
                    <p className={`text-lg font-black ${member.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>{member.balance >= 0 ? '+' : ''}{member.balance.toFixed(2)} €</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stats */}
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

            {/* Activité Récente */}
            <div className="bg-white dark:bg-black p-6 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h2 className="text-2xl font-black text-black dark:text-white uppercase mb-4">Activité Récente</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activities.map(activity => <ActivityItem key={activity.id} activity={activity} />)}
                {activities.length === 0 && <p className="text-gray-500">Aucune activité.</p>}
              </div>
            </div>
          </div>
        </div>
        
        {/* Zone de danger */}
        <div className="border-t-4 border-black dark:border-white pt-8 mt-12">
          <h3 className="text-xl font-black text-red-600 uppercase mb-4">Zone de danger</h3>
          <button onClick={() => setIsDeleteModalOpen(true)} className="px-6 py-3 border-2 border-red-600 text-lg font-bold text-red-600 bg-white hover:bg-red-600 hover:text-white transition-all uppercase">Supprimer le groupe</button>
        </div>
      </main>

      {/* Modales */}
      <Modal isOpen={isAddExpenseModalOpen} onClose={() => setIsAddExpenseModalOpen(false)} title="Ajouter une dépense">
        <AddExpenseForm group={group} onClose={() => setIsAddExpenseModalOpen(false)} onExpenseAdded={handleExpenseAdded} />
      </Modal>
      
      {isEditExpenseModalOpen && selectedExpense && (
        <Modal isOpen={isEditExpenseModalOpen} onClose={() => setIsEditExpenseModalOpen(false)} title="Modifier la dépense">
          <EditExpenseForm group={group} expense={selectedExpense} onClose={() => setIsEditExpenseModalOpen(false)} onExpenseUpdated={handleExpenseUpdated} />
        </Modal>
      )}

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

      {isDeleteExpenseModalOpen && selectedExpense && (
        <Modal isOpen={isDeleteExpenseModalOpen} onClose={() => setIsDeleteExpenseModalOpen(false)} title="Supprimer la dépense">
          <div className="space-y-6">
            <p>Êtes-vous sûr de vouloir supprimer la dépense <span className="font-bold">"{selectedExpense.description}"</span> ?</p>
            <div className="flex gap-4">
              <button onClick={() => setIsDeleteExpenseModalOpen(false)} className="flex-1 py-3 border-2 border-black text-lg font-bold text-black bg-white hover:bg-gray-100 transition-all uppercase">Annuler</button>
              <button onClick={handleDeleteExpense} className="flex-1 py-3 border-2 border-red-600 text-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-all uppercase">Confirmer</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
