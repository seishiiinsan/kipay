'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Link from 'next/link';
import Modal from '@/components/Modal';
import CreateGroupForm from '@/components/CreateGroupForm';
import JoinGroupForm from '@/components/JoinGroupForm';

export default function DashboardPage() {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [groups, setGroups] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (token && user?.id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const userId = user.id;

          const groupsRes = await fetch(`/api/users/${userId}/groups`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const groupsData = await groupsRes.json();
          if (groupsRes.ok) setGroups(groupsData.groups);

          const balanceRes = await fetch(`/api/users/${userId}/balance`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const balanceData = await balanceRes.json();
          if (balanceRes.ok) setBalance(balanceData.balance);

        } catch (error) {
          console.error("Failed to fetch dashboard data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [token, isAuthenticated, authLoading, router, user]);

  const handleGroupCreated = (newGroup) => {
    setGroups(prevGroups => [newGroup, ...prevGroups]);
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center text-black dark:text-white font-black text-2xl uppercase">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <section className="mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-black p-6 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">On vous doit</h3>
              <p className="text-4xl font-black text-green-500 mt-2">
                {balance ? `${balance.totalOwedToUser.toFixed(2)} €` : '...'}
              </p>
            </div>
            <div className="bg-white dark:bg-black p-6 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Vous devez</h3>
              <p className="text-4xl font-black text-red-500 mt-2">
                {balance ? `${balance.totalUserOwes.toFixed(2)} €` : '...'}
              </p>
            </div>
            <div className="bg-indigo-500 text-white p-6 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
              <h3 className="text-sm font-bold text-indigo-200 uppercase tracking-wider">Solde Net</h3>
              <p className={`text-4xl font-black mt-2 ${balance && balance.netBalance >= 0 ? 'text-white' : 'text-yellow-300'}`}>
                {balance ? `${balance.netBalance.toFixed(2)} €` : '...'}
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black text-black dark:text-white uppercase">Vos Groupes</h2>
            <div className="flex gap-4">
              <button onClick={() => setIsJoinModalOpen(true)} className="px-6 py-3 border-2 border-black text-lg font-black text-black bg-white hover:bg-gray-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-black dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase">
                Rejoindre
              </button>
              <button onClick={() => setIsCreateModalOpen(true)} className="px-6 py-3 border-2 border-black text-lg font-black text-white bg-black hover:bg-indigo-600 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] dark:border-white dark:bg-white dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] uppercase">
                + Créer
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups.map(group => (
              <Link href={`/dashboard/groups/${group.id}`} key={group.id} className="block bg-white dark:bg-black p-6 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] transition-all">
                <h3 className="text-2xl font-black text-black dark:text-white uppercase truncate">{group.name}</h3>
                <p className="text-sm font-bold text-indigo-500 mt-2">Voir le groupe →</p>
              </Link>
            ))}
            {groups.length === 0 && !loading && (
              <p className="text-gray-500">Vous n&#39;avez pas encore de groupe. Créez-en un !</p>
            )}
          </div>
        </section>
      </main>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Créer un nouveau groupe">
        <CreateGroupForm onClose={() => setIsCreateModalOpen(false)} onGroupCreated={handleGroupCreated} />
      </Modal>

      <Modal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} title="Rejoindre un groupe">
        <JoinGroupForm onClose={() => setIsJoinModalOpen(false)} />
      </Modal>
    </div>
  );
}
