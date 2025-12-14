'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AddExpenseForm({ group, onClose, onExpenseAdded }) {
  const { user, token } = useAuth();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(user?.id);
  
  // Gestion des participants
  // Par défaut, tout le monde est sélectionné
  const [selectedMemberIds, setSelectedMemberIds] = useState(group.members.map(m => m.id));
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleMember = (memberId) => {
    setSelectedMemberIds(prev => {
      if (prev.includes(memberId)) {
        // On ne peut pas désélectionner le dernier membre (il faut au moins 1 participant)
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (selectedMemberIds.length === 0) {
      setError("Il faut au moins un participant.");
      setLoading(false);
      return;
    }

    // Répartition équitable
    const numParticipants = selectedMemberIds.length;
    const amountPerPerson = parseFloat(amount) / numParticipants;

    const participants = selectedMemberIds.map(memberId => ({
      user_id: memberId,
      amount_owed: amountPerPerson.toFixed(2),
    }));

    // Correction des arrondis sur le dernier participant
    // Ex: 10€ / 3 = 3.33, 3.33, 3.33 -> Total 9.99. Il manque 0.01.
    // On ajoute la différence au premier participant pour que le total soit exact.
    const currentTotal = participants.reduce((sum, p) => sum + parseFloat(p.amount_owed), 0);
    const diff = parseFloat(amount) - currentTotal;
    if (diff !== 0) {
      participants[0].amount_owed = (parseFloat(participants[0].amount_owed) + diff).toFixed(2);
    }

    const expenseData = {
      description,
      amount: parseFloat(amount),
      group_id: group.id,
      paid_by_user_id: parseInt(paidBy),
      participants,
    };

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add expense');
      }

      const newExpense = await res.json();
      onExpenseAdded(newExpense.expense);
      onClose();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="description" className="text-lg font-bold text-black dark:text-white uppercase">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-2 block w-full p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          placeholder="Ex: Courses, Restaurant..."
        />
      </div>

      <div>
        <label htmlFor="amount" className="text-lg font-bold text-black dark:text-white uppercase">Montant (€)</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          step="0.01"
          min="0.01"
          className="mt-2 block w-full p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          placeholder="0.00"
        />
      </div>

      <div>
        <label htmlFor="paidBy" className="text-lg font-bold text-black dark:text-white uppercase">Payé par</label>
        <select
          id="paidBy"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          required
          className="mt-2 block w-full p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-gray-900 text-black dark:text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
        >
          {group.members.map(member => (
            <option key={member.id} value={member.id}>
              {member.id === user.id ? `${member.name} (Moi)` : member.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-lg font-bold text-black dark:text-white uppercase mb-2 block">Pour qui ?</label>
        <div className="grid grid-cols-2 gap-3">
          {group.members.map(member => {
            const isSelected = selectedMemberIds.includes(member.id);
            return (
              <div 
                key={member.id}
                onClick={() => toggleMember(member.id)}
                className={`cursor-pointer p-3 border-2 flex items-center justify-between transition-all ${
                  isSelected 
                    ? 'border-black bg-indigo-100 dark:bg-indigo-900/30 dark:border-white' 
                    : 'border-gray-300 bg-white dark:bg-black dark:border-gray-700 opacity-60'
                }`}
              >
                <span className={`font-bold ${isSelected ? 'text-black dark:text-white' : 'text-gray-500'}`}>
                  {member.id === user.id ? 'Moi' : member.name}
                </span>
                {isSelected && (
                  <span className="text-indigo-600 font-black">✓</span>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-500 mt-2 font-bold">
          {selectedMemberIds.length} personne(s) sélectionnée(s)
        </p>
      </div>

      {error && <p className="text-red-500 font-bold text-center bg-red-50 p-3 border-2 border-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-8 flex items-center justify-center px-8 py-4 border-2 border-black text-xl font-black text-white bg-black hover:bg-indigo-600 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] dark:border-white dark:bg-white dark:text-black dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
      >
        {loading ? 'Ajout en cours...' : 'Ajouter la dépense'}
      </button>
    </form>
  );
}
