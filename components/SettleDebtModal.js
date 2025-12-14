'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function SettleDebtModal({ group, onClose, onPaymentMade }) {
  const { user, token } = useAuth();
  const { showToast } = useToast();
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(`/api/groups/${group.id}/balance`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        
        const mySettlements = data.settlements.filter(s => s.from === user.id || s.to === user.id);
        setSettlements(mySettlements);
      } catch (error) {
        console.error("Failed to fetch balance", error);
        showToast("Erreur lors du calcul des dettes", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, [group.id, token, user.id, showToast]);

  const handlePayment = async () => {
    if (!selectedSettlement) return;
    setPaymentLoading(true);

    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: selectedSettlement.amount,
          group_id: group.id,
          paid_by_user_id: selectedSettlement.from,
          paid_to_user_id: selectedSettlement.to,
        }),
      });

      if (res.ok) {
        showToast('Remboursement enregistré !', 'success');
        onPaymentMade();
        onClose();
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error("Payment failed", error);
      showToast("Le remboursement a échoué", "error");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center font-bold">Calcul des dettes...</div>;

  if (selectedSettlement) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-500 uppercase">Confirmer le remboursement</p>
          <div className="my-6 p-6 bg-gray-100 dark:bg-gray-800 border-2 border-black dark:border-white">
            <p className="text-xl font-bold mb-2">
              <span className="text-indigo-600">Vous</span>
              {' → '}
              <span className="text-green-600">{selectedSettlement.toName}</span>
            </p>
            <p className="text-4xl font-black">{selectedSettlement.amount.toFixed(2)} €</p>
          </div>
          <p className="text-sm text-gray-500">
            Cela enregistrera que ce paiement a bien été effectué hors de l&#39;application.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedSettlement(null)}
            className="flex-1 py-3 border-2 border-black text-lg font-bold text-black bg-white hover:bg-gray-100 transition-all uppercase"
          >
            Retour
          </button>
          <button
            onClick={handlePayment}
            disabled={paymentLoading}
            className="flex-1 py-3 border-2 border-black text-lg font-bold text-white bg-black hover:bg-green-600 transition-all uppercase disabled:opacity-50"
          >
            {paymentLoading ? 'Enregistrement...' : 'Confirmer'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {settlements.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-2xl font-black text-green-500 uppercase mb-2">Vous êtes à jour !</p>
          <p className="text-gray-500">Vous ne devez rien et personne ne vous doit rien.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {settlements.map((s, i) => {
            const isDebt = s.from === user.id;
            return (
              <div key={i} className={`flex justify-between items-center p-4 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] ${isDebt ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
                <div>
                  <p className="font-bold text-lg">
                    {isDebt ? (
                      <>Vous devez à <span className="text-indigo-600">{s.toName}</span></>
                    ) : (
                      <><span className="text-indigo-600">{s.fromName}</span> vous doit</>
                    )}
                  </p>
                  <p className={`text-2xl font-black ${isDebt ? 'text-red-600' : 'text-green-600'}`}>
                    {s.amount.toFixed(2)} €
                  </p>
                </div>
                {isDebt && (
                  <button
                    onClick={() => setSelectedSettlement(s)}
                    className="px-4 py-2 border-2 border-black bg-black text-white font-bold uppercase hover:bg-white hover:text-black transition-all"
                  >
                    Rembourser
                  </button>
                )}
                {!isDebt && (
                  <span className="text-xs font-bold text-gray-500 uppercase bg-white dark:bg-black border border-gray-300 px-2 py-1">
                    En attente
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
