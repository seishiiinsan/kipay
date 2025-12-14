import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/users - Lister tous les utilisateurs avec recherche et pagination
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let text = 'SELECT id, name, email, created_at FROM users';
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push(`(name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (conditions.length > 0) {
      text += ' WHERE ' + conditions.join(' AND ');
    }

    text += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const { rows } = await query(text, params);
    
    // Compter le total pour la pagination
    let countText = 'SELECT COUNT(*) FROM users';
    const countParams = [];
    if (conditions.length > 0) {
      countText += ' WHERE ' + conditions.join(' AND ');
      // On réutilise le paramètre de recherche s'il existe
      if (search) countParams.push(`%${search}%`);
    }
    const countResult = await query(countText, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({ 
      users: rows,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + rows.length < total
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/users - Créer un nouvel utilisateur
export async function POST(request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const { rows } = await query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at',
      [name, email]
    );

    return NextResponse.json({ user: rows[0] }, { status: 201 });
  } catch (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
