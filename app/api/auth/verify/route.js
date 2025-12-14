import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // 1. Trouver l'utilisateur avec ce token
    const userRes = await query('SELECT id FROM users WHERE verification_token = $1', [token]);
    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }
    const userId = userRes.rows[0].id;

    // 2. Mettre à jour l'utilisateur
    await query(
      'UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE id = $1',
      [userId]
    );

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
