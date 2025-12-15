import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/groups/by-code/:code - Obtenir l'ID et les infos de base d'un groupe via son code
export async function GET(request, { params }) {
  const { code } = await params;
  try {
    const text = `
      SELECT id, name, invite_code, created_by_user_id, created_at 
      FROM groups 
      WHERE invite_code = $1
    `;
    const { rows } = await query(text, [code.toUpperCase()]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json({ group: rows[0] }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching group by code ${code}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
