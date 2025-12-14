import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/groups/:id/payments - Lister les remboursements d'un groupe
export async function GET(request, { params }) {
  const { id: groupId } = params;
  try {
    const text = `
      SELECT 
        p.id, 
        p.amount, 
        p.date, 
        p.created_at,
        payer.name as paid_by_name,
        payee.name as paid_to_name
      FROM payments p
      JOIN users payer ON p.paid_by_user_id = payer.id
      JOIN users payee ON p.paid_to_user_id = payee.id
      WHERE p.group_id = $1
      ORDER BY p.date DESC, p.created_at DESC
    `;
    const { rows } = await query(text, [groupId]);
    return NextResponse.json({ payments: rows }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching payments for group ${groupId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
