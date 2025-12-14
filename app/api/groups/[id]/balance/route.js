import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/groups/:id/balance - Calcule et simplifie les dettes d'un groupe
export async function GET(request, { params }) {
  const { id: groupId } = await params;
  try {
    const membersRes = await query('SELECT user_id FROM group_members WHERE group_id = $1', [groupId]);
    const memberIds = membersRes.rows.map(r => r.user_id);
    
    if (memberIds.length === 0) {
      return NextResponse.json({ settlements: [] }, { status: 200 });
    }

    const balances = new Map(memberIds.map(id => [id, 0]));

    // + ce qu'ils ont payé
    const paidRes = await query('SELECT paid_by_user_id, SUM(amount) as total FROM expenses WHERE group_id = $1 GROUP BY paid_by_user_id', [groupId]);
    paidRes.rows.forEach(row => {
      const current = balances.get(row.paid_by_user_id) || 0;
      balances.set(row.paid_by_user_id, current + parseFloat(row.total));
    });

    // - ce qu'ils doivent
    const owedRes = await query(`
      SELECT ep.user_id, SUM(ep.amount_owed) as total 
      FROM expense_participants ep
      JOIN expenses e ON ep.expense_id = e.id
      WHERE e.group_id = $1
      GROUP BY ep.user_id
    `, [groupId]);
    owedRes.rows.forEach(row => {
      const current = balances.get(row.user_id) || 0;
      balances.set(row.user_id, current - parseFloat(row.total));
    });

    // + les remboursements FAITS
    const paymentsMadeRes = await query('SELECT paid_by_user_id, SUM(amount) as total FROM payments WHERE group_id = $1 GROUP BY paid_by_user_id', [groupId]);
    paymentsMadeRes.rows.forEach(row => {
      const current = balances.get(row.paid_by_user_id) || 0;
      balances.set(row.paid_by_user_id, current + parseFloat(row.total));
    });
    
    // - les remboursements REÇUS
    const paymentsReceivedRes = await query('SELECT paid_to_user_id, SUM(amount) as total FROM payments WHERE group_id = $1 GROUP BY paid_to_user_id', [groupId]);
    paymentsReceivedRes.rows.forEach(row => {
      const current = balances.get(row.paid_to_user_id) || 0;
      balances.set(row.paid_to_user_id, current - parseFloat(row.total));
    });

    // DEBUG: Afficher les soldes
    console.log('Balances:', Object.fromEntries(balances));

    // Simplifier les dettes
    const debtors = [];
    const creditors = [];
    balances.forEach((amount, userId) => {
      // On arrondit pour éviter les problèmes de virgule flottante
      const roundedAmount = Math.round(amount * 100) / 100;
      if (roundedAmount < -0.01) debtors.push({ userId, amount: roundedAmount });
      if (roundedAmount > 0.01) creditors.push({ userId, amount: roundedAmount });
    });

    debtors.sort((a, b) => a.amount - b.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements = [];
    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];
      const amountToSettle = Math.min(Math.abs(debtor.amount), creditor.amount);

      // On arrondit le montant du virement
      const roundedSettle = Math.round(amountToSettle * 100) / 100;

      settlements.push({ from: debtor.userId, to: creditor.userId, amount: roundedSettle });

      debtor.amount += roundedSettle;
      creditor.amount -= roundedSettle;

      // On nettoie les soldes proches de 0
      if (Math.abs(debtor.amount) < 0.01) debtors.shift();
      if (Math.abs(creditor.amount) < 0.01) creditors.shift();
    }

    const userIds = [...new Set(settlements.flatMap(s => [s.from, s.to]))];
    const usersRes = await query(`SELECT id, name FROM users WHERE id = ANY($1::int[])`, [userIds]);
    const userMap = new Map(usersRes.rows.map(u => [u.id, u.name]));

    const detailedSettlements = settlements.map(s => ({
      ...s,
      fromName: userMap.get(s.from),
      toName: userMap.get(s.to),
    }));

    return NextResponse.json({ settlements: detailedSettlements }, { status: 200 });
  } catch (error) {
    console.error(`Error calculating balance for group ${groupId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
