import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// DELETE /api/groups/:id/members/:userId - Retirer un membre d'un groupe
export async function DELETE(request, { params }) {
  const { id: groupId, userId } = params;
  try {
    // TODO: Logique avancée à ajouter ici
    // Avant de supprimer, vérifier si l'utilisateur a un solde de 0 dans le groupe.
    // Si ce n'est pas le cas, renvoyer une erreur 409 (Conflict).
    // Pour l'instant, on permet la suppression directe.

    const text = 'DELETE FROM group_members WHERE group_id = $1 AND user_id = $2 RETURNING *';
    const { rows } = await query(text, [groupId, userId]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Member not found in this group' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error) {
    console.error(`Error removing member ${userId} from group ${groupId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
