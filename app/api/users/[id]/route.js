import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/users/:id - Obtenir un utilisateur spécifique
export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const { rows } = await query('SELECT id, name, email, notify_new_expense, notify_debt_reminder, created_at FROM users WHERE id = $1', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user: rows[0] }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/users/:id - Mettre à jour un utilisateur
export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, email, notify_new_expense, notify_debt_reminder } = body;

    // Validation
    if (!name && !email && notify_new_expense === undefined && notify_debt_reminder === undefined) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const fields = [];
    const values = [];
    let fieldIndex = 1;

    if (name) {
      fields.push(`name = $${fieldIndex++}`);
      values.push(name);
    }
    if (email) {
      fields.push(`email = $${fieldIndex++}`);
      values.push(email);
    }
    if (notify_new_expense !== undefined) {
      fields.push(`notify_new_expense = $${fieldIndex++}`);
      values.push(notify_new_expense);
    }
    if (notify_debt_reminder !== undefined) {
      fields.push(`notify_debt_reminder = $${fieldIndex++}`);
      values.push(notify_debt_reminder);
    }

    values.push(id);

    const text = `UPDATE users SET ${fields.join(', ')} WHERE id = $${fieldIndex} RETURNING id, name, email, notify_new_expense, notify_debt_reminder, created_at`;
    
    const { rows } = await query(text, values);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: rows[0] }, { status: 200 });
  } catch (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    console.error(`Error updating user ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
