import { query } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/auth';
import { NextResponse } from 'next/server';

// PUT /api/users/:id/password - Changer le mot de passe
export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Le nouveau mot de passe doit faire au moins 6 caractères.' }, { status: 400 });
    }

    // 1. Récupérer l'utilisateur et son hash de mot de passe actuel
    const userRes = await query('SELECT password FROM users WHERE id = $1', [id]);
    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé.' }, { status: 404 });
    }
    const user = userRes.rows[0];

    // 2. Vérifier l'ancien mot de passe
    const isPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Le mot de passe actuel est incorrect.' }, { status: 401 });
    }

    // 3. Hacher et mettre à jour le nouveau mot de passe
    const hashedNewPassword = await hashPassword(newPassword);
    await query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, id]);

    return NextResponse.json({ message: 'Mot de passe mis à jour avec succès.' }, { status: 200 });

  } catch (error) {
    console.error(`Error changing password for user ${id}:`, error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
