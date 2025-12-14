import { query } from '@/lib/db';
import { verifyPassword, signJWT } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { rows } = await query('SELECT id, name, email, password FROM users WHERE email = $1', [email]);
    const user = rows[0];

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Créer le payload du token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = await signJWT(tokenPayload);

    return NextResponse.json({ 
      message: 'Login successful',
      token: token 
    }, { status: 200 });

  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
