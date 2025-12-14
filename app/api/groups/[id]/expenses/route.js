import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/groups/:id/expenses - Lister les dépenses d'un groupe
export async function GET(request, { params }) {
  const { id: groupId } = params;
  try {
    const text = `
      SELECT 
        e.id, 
        e.description, 
        e.amount, 
        e.date, 
        e.created_at,
        u.name as paid_by_name
      FROM expenses e
      JOIN users u ON e.paid_by_user_id = u.id
      WHERE e.group_id = $1
      ORDER BY e.date DESC, e.created_at DESC
    `;
    const { rows } = await query(text, [groupId]);
    return NextResponse.json({ expenses: rows }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching expenses for group ${groupId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
