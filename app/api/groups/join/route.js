import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { logActivity } from '@/lib/activity';

export async function POST(request) {
  try {
    const { invite_code, user_id } = await request.json();

    if (!invite_code || !user_id) {
      return NextResponse.json({ error: 'Le code et l\'utilisateur sont requis' }, { status: 400 });
    }

    const findGroupQuery = 'SELECT id FROM groups WHERE invite_code = $1';
    const groupRes = await query(findGroupQuery, [invite_code.toUpperCase()]);

    if (groupRes.rows.length === 0) {
      return NextResponse.json({ error: 'Code d\'invitation invalide' }, { status: 404 });
    }
    const groupId = groupRes.rows[0].id;

    const addMemberQuery = 'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) RETURNING *';
    const { rows } = await query(addMemberQuery, [groupId, user_id]);

    // Log de l'activité
    await logActivity(groupId, user_id, 'MEMBER_JOIN', {});

    return NextResponse.json({ 
      message: 'Vous avez rejoint le groupe avec succès',
      group_id: groupId,
      membership: rows[0] 
    }, { status: 200 });

  } catch (error) {
    if (error.code === '23505') {
      const body = await request.clone().json(); 
      const code = body.invite_code;
      const groupRes = await query('SELECT id FROM groups WHERE invite_code = $1', [code.toUpperCase()]);
      if (groupRes.rows.length > 0) {
        return NextResponse.json({ error: 'Vous êtes déjà membre de ce groupe', group_id: groupRes.rows[0].id }, { status: 409 });
      }
      return NextResponse.json({ error: 'Vous êtes déjà membre de ce groupe' }, { status: 409 });
    }
    console.error('Error joining group:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
