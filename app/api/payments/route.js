import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { logActivity } from '@/lib/activity';

// POST /api/payments - Enregistrer un remboursement
export async function POST(request) {
  try {
    const { amount, group_id, paid_by_user_id, paid_to_user_id } = await request.json();

    if (!amount || !group_id || !paid_by_user_id || !paid_to_user_id) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    const text = `
      INSERT INTO payments (amount, group_id, paid_by_user_id, paid_to_user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await query(text, [amount, group_id, paid_by_user_id, paid_to_user_id]);

    // Log de l'activité
    await logActivity(group_id, paid_by_user_id, 'PAYMENT', {
      amount: amount,
      from: paid_by_user_id,
      to: paid_to_user_id,
    });

    return NextResponse.json({ payment: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
