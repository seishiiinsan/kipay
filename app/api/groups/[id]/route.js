import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/groups/:id - Obtenir les détails d'un groupe
export async function GET(request, { params }) {
  const { id } = params;
  try {
    // Récupérer les infos du groupe
    const groupQuery = 'SELECT id, name, created_by_user_id, created_at FROM groups WHERE id = $1';
    const groupRes = await query(groupQuery, [id]);

    if (groupRes.rows.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    const group = groupRes.rows[0];

    // Récupérer les membres du groupe
    const membersQuery = `
      SELECT u.id, u.name, u.email 
      FROM users u
      JOIN group_members gm ON u.id = gm.user_id
      WHERE gm.group_id = $1
    `;
    const membersRes = await query(membersQuery, [id]);
    group.members = membersRes.rows;

    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching group ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/groups/:id - Mettre à jour un groupe
export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const text = 'UPDATE groups SET name = $1 WHERE id = $2 RETURNING id, name, created_at';
    const { rows } = await query(text, [name, id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json({ group: rows[0] }, { status: 200 });
  } catch (error) {
    console.error(`Error updating group ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/groups/:id - Supprimer un groupe
export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    // On pourrait ajouter une logique pour vérifier si le groupe a des dettes avant de supprimer
    const text = 'DELETE FROM groups WHERE id = $1 RETURNING *';
    const { rows } = await query(text, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error) {
    console.error(`Error deleting group ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
