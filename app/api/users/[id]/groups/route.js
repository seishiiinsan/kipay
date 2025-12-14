import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/users/:id/groups - Lister les groupes d'un utilisateur
export async function GET(request, { params }) {
  const { id } = params;
  try {
    const text = `
      SELECT g.id, g.name, g.created_at
      FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      WHERE gm.user_id = $1
      ORDER BY g.created_at DESC
    `;
    const { rows } = await query(text, [id]);
    return NextResponse.json({ groups: rows }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching groups for user ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
