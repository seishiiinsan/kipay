import { getClient } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST /api/expenses - Créer une nouvelle dépense
export async function POST(request) {
  const client = await getClient();
  try {
    const body = await request.json();
    const { description, amount, date, group_id, paid_by_user_id, participants } = body;

    // Validation de base
    if (!description || !amount || !group_id || !paid_by_user_id || !participants || participants.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Vérification que la somme des parts correspond (à peu près) au montant total
    const totalSplit = participants.reduce((sum, p) => sum + parseFloat(p.amount_owed), 0);
    if (Math.abs(totalSplit - parseFloat(amount)) > 0.05) { // Tolérance de 5 centimes pour les arrondis
      return NextResponse.json({ error: 'Split amounts do not match total amount' }, { status: 400 });
    }

    await client.query('BEGIN');

    // 1. Insérer la dépense
    const insertExpenseQuery = `
      INSERT INTO expenses (description, amount, date, group_id, paid_by_user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, description, amount, date, created_at
    `;
    const expenseRes = await client.query(insertExpenseQuery, [
      description, 
      amount, 
      date || new Date(), 
      group_id, 
      paid_by_user_id
    ]);
    const expense = expenseRes.rows[0];

    // 2. Insérer les participants
    const insertParticipantQuery = `
      INSERT INTO expense_participants (expense_id, user_id, amount_owed)
      VALUES ($1, $2, $3)
    `;

    for (const p of participants) {
      await client.query(insertParticipantQuery, [expense.id, p.user_id, p.amount_owed]);
    }

    await client.query('COMMIT');

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
