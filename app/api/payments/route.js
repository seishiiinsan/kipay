import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST /api/payments - Enregistrer un remboursement
export async function POST(request) {
  try {
    const { amount, date, group_id, paid_by_user_id, paid_to_user_id } = await request.json();

    // Validation
    if (!amount || !group_id || !paid_by_user_id || !paid_to_user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (paid_by_user_id === paid_to_user_id) {
      return NextResponse.json({ error: 'Cannot pay yourself' }, { status: 400 });
    }

    const text = `
      INSERT INTO payments (amount, date, group_id, paid_by_user_id, paid_to_user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, amount, date, created_at
    `;
    
    const { rows } = await query(text, [
      amount, 
      date || new Date(), 
      group_id, 
      paid_by_user_id, 
      paid_to_user_id
    ]);

    return NextResponse.json({ payment: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
