import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST /api/groups/join - Rejoindre un groupe avec un code
export async function POST(request) {
  try {
    const { invite_code, user_id } = await request.json();

    if (!invite_code || !user_id) {
      return NextResponse.json({ error: 'invite_code and user_id are required' }, { status: 400 });
    }

    // 1. Trouver le groupe correspondant au code
    const findGroupQuery = 'SELECT id FROM groups WHERE invite_code = $1';
    const groupRes = await query(findGroupQuery, [invite_code.toUpperCase()]);

    if (groupRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
    }
    const groupId = groupRes.rows[0].id;

    // 2. Ajouter l'utilisateur comme membre
    const addMemberQuery = 'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) RETURNING *';
    const { rows } = await query(addMemberQuery, [groupId, user_id]);

    return NextResponse.json({ 
      message: 'Successfully joined group',
      group_id: groupId,
      membership: rows[0] 
    }, { status: 200 });

  } catch (error) {
    if (error.code === '23505') { // unique_violation
      return NextResponse.json({ error: 'You are already a member of this group' }, { status: 409 });
    }
    console.error('Error joining group:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
