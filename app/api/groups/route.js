import { query, getClient } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST /api/groups - Créer un nouveau groupe
export async function POST(request) {
  const client = await getClient();
  try {
    const { name, created_by_user_id } = await request.json();

    if (!name || !created_by_user_id) {
      return NextResponse.json({ error: 'Name and created_by_user_id are required' }, { status: 400 });
    }

    // On utilise une transaction pour s'assurer que le groupe est créé ET que l'utilisateur est ajouté
    await client.query('BEGIN');

    // 1. Créer le groupe
    const createGroupText = 'INSERT INTO groups (name, created_by_user_id) VALUES ($1, $2) RETURNING id, name, created_at';
    const groupRes = await client.query(createGroupText, [name, created_by_user_id]);
    const group = groupRes.rows[0];

    // 2. Ajouter le créateur comme membre
    const addMemberText = 'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)';
    await client.query(addMemberText, [group.id, created_by_user_id]);

    await client.query('COMMIT');

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
