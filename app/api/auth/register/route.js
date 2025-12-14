import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const { rows } = await query(
      'INSERT INTO users (name, email, password, verification_token) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
      [name, email, hashedPassword, verificationToken]
    );

    // Envoyer l'email de vérification
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({ user: rows[0] }, { status: 201 });
  } catch (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
