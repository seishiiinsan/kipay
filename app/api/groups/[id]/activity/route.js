import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/groups/:id/activity - Récupérer l'activité d'un groupe
export async function GET(request, { params }) {
  const { id: groupId } = await params;
  try {
    const text = `
      SELECT 
        a.id, 
        a.type, 
        a.details, 
        a.created_at,
        u.name as user_name,
        u.avatar_variant,
        u.avatar_palette
      FROM activities a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.group_id = $1
      ORDER BY a.created_at DESC
      LIMIT 50;
    `;
    const { rows } = await query(text, [groupId]);
    return NextResponse.json({ activities: rows }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching activity for group ${groupId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
