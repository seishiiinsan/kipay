import { query, getClient } from '@/lib/db';
import { NextResponse } from 'next/server';

// Fonction pour générer un code aléatoire
function generateInviteCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// POST /api/groups - Créer un nouveau groupe
export async function POST(request) {
  const client = await getClient();
  try {
    const { name, created_by_user_id } = await request.json();

    if (!name || !created_by_user_id) {
      return NextResponse.json({ error: 'Name and created_by_user_id are required' }, { status: 400 });
    }

    const inviteCode = generateInviteCode();

    await client.query('BEGIN');

    // 1. Créer le groupe avec le code d'invitation
    const createGroupText = 'INSERT INTO groups (name, created_by_user_id, invite_code) VALUES ($1, $2, $3) RETURNING id, name, invite_code, created_at';
    const groupRes = await client.query(createGroupText, [name, created_by_user_id, inviteCode]);
    const group = groupRes.rows[0];

    // 2. Ajouter le créateur comme membre
    const addMemberText = 'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)';
    await client.query(addMemberText, [group.id, created_by_user_id]);

    await client.query('COMMIT');

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    // Gestion de la collision de code (très rare mais possible)
    if (error.code === '23505' && error.constraint === 'groups_invite_code_key') {
      return NextResponse.json({ error: 'Failed to generate unique code, please try again' }, { status: 409 });
    }
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
