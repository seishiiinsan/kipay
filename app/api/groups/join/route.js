import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST /api/groups/join - Rejoindre un groupe avec un code
export async function POST(request) {
  try {
    const { invite_code, user_id } = await request.json();

    if (!invite_code || !user_id) {
      return NextResponse.json({ error: 'Le code et l\'utilisateur sont requis' }, { status: 400 });
    }

    // 1. Trouver le groupe correspondant au code
    const findGroupQuery = 'SELECT id FROM groups WHERE invite_code = $1';
    const groupRes = await query(findGroupQuery, [invite_code.toUpperCase()]);

    if (groupRes.rows.length === 0) {
      return NextResponse.json({ error: 'Code d\'invitation invalide' }, { status: 404 });
    }
    const groupId = groupRes.rows[0].id;

    // 2. Ajouter l'utilisateur comme membre
    const addMemberQuery = 'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) RETURNING *';
    const { rows } = await query(addMemberQuery, [groupId, user_id]);

    return NextResponse.json({ 
      message: 'Vous avez rejoint le groupe avec succès',
      group_id: groupId,
      membership: rows[0] 
    }, { status: 200 });

  } catch (error) {
    // Gestion spécifique pour "Déjà membre"
    if (error.code === '23505') { // unique_violation
      try {
        // On essaie de récupérer l'ID du groupe pour rediriger l'utilisateur
        // On doit re-parser le body car on est dans le catch
        const body = await request.clone().json(); 
        const code = body.invite_code;
        
        const findGroupQuery = 'SELECT id FROM groups WHERE invite_code = $1';
        const groupRes = await query(findGroupQuery, [code.toUpperCase()]);
        
        if (groupRes.rows.length > 0) {
          return NextResponse.json({ 
            error: 'Vous êtes déjà membre de ce groupe',
            group_id: groupRes.rows[0].id 
          }, { status: 409 });
        }
      } catch (innerError) {
        console.error('Error recovering group ID in catch block:', innerError);
      }
      
      // Si on n'arrive pas à récupérer l'ID, on renvoie juste l'erreur 409
      return NextResponse.json({ error: 'Vous êtes déjà membre de ce groupe' }, { status: 409 });
    }

    console.error('Error joining group:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
