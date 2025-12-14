import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST /api/groups/:id/members - Ajouter un membre à un groupe
export async function POST(request, { params }) {
  const { id: groupId } = params;
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const text = 'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) RETURNING *';
    const { rows } = await query(text, [groupId, user_id]);

    return NextResponse.json({ member: rows[0] }, { status: 201 });
  } catch (error) {
    if (error.code === '23503') { // foreign_key_violation (group or user doesn't exist)
      return NextResponse.json({ error: 'Group or User not found' }, { status: 404 });
    }
    if (error.code === '23505') { // unique_violation (member already in group)
      return NextResponse.json({ error: 'User is already a member of this group' }, { status: 409 });
    }
    console.error(`Error adding member to group ${groupId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
