import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/groups/preview?code=XYZ - Obtenir les infos de base d'un groupe via son code
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Code required' }, { status: 400 });
  }

  try {
    const text = `
      SELECT id, name, created_at 
      FROM groups 
      WHERE invite_code = $1
    `;
    const { rows } = await query(text, [code.toUpperCase()]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // On renvoie juste le nom et l'ID, pas les membres ni les dépenses (sécurité)
    return NextResponse.json({ group: rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Error previewing group:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
