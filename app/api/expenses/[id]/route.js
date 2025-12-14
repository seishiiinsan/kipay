import { query, getClient } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/expenses/:id - Obtenir le détail d'une dépense
export async function GET(request, { params }) {
  const { id } = params;
  try {
    // Récupérer la dépense
    const expenseQuery = `
      SELECT e.id, e.description, e.amount, e.date, e.group_id, u.name as paid_by_name, e.paid_by_user_id
      FROM expenses e
      JOIN users u ON e.paid_by_user_id = u.id
      WHERE e.id = $1
    `;
    const expenseRes = await query(expenseQuery, [id]);

    if (expenseRes.rows.length === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    const expense = expenseRes.rows[0];

    // Récupérer les participants
    const participantsQuery = `
      SELECT u.id, u.name, ep.amount_owed, ep.is_settled
      FROM users u
      JOIN expense_participants ep ON u.id = ep.user_id
      WHERE ep.expense_id = $1
    `;
    const participantsRes = await query(participantsQuery, [id]);
    expense.participants = participantsRes.rows;

    return NextResponse.json({ expense }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching expense ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/expenses/:id - Supprimer une dépense
export async function DELETE(request, { params }) {
  const { id } = params;
  const client = await getClient();
  try {
    // On supprime la dépense et les participants en cascade grâce à la configuration de la BDD (ON DELETE CASCADE)
    await client.query('BEGIN');
    const text = 'DELETE FROM expenses WHERE id = $1 RETURNING *';
    const { rows } = await client.query(text, [id]);
    await client.query('COMMIT');

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error deleting expense ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}

// PUT /api/expenses/:id - Modifier une dépense (logique complexe, simplifiée ici)
export async function PUT(request, { params }) {
  const { id } = params;
  const client = await getClient();
  try {
    const body = await request.json();
    const { description, amount, date, paid_by_user_id, participants } = body;

    // Validation
    if (!description || !amount || !participants || participants.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await client.query('BEGIN');

    // 1. Mettre à jour la dépense principale
    const updateExpenseQuery = `
      UPDATE expenses 
      SET description = $1, amount = $2, date = $3, paid_by_user_id = $4
      WHERE id = $5
      RETURNING *
    `;
    const expenseRes = await client.query(updateExpenseQuery, [description, amount, date, paid_by_user_id, id]);
    if (expenseRes.rows.length === 0) {
      throw new Error('Expense not found');
    }

    // 2. Supprimer les anciens participants
    await client.query('DELETE FROM expense_participants WHERE expense_id = $1', [id]);

    // 3. Insérer les nouveaux participants
    const insertParticipantQuery = `
      INSERT INTO expense_participants (expense_id, user_id, amount_owed)
      VALUES ($1, $2, $3)
    `;
    for (const p of participants) {
      await client.query(insertParticipantQuery, [id, p.user_id, p.amount_owed]);
    }

    await client.query('COMMIT');

    return NextResponse.json({ expense: expenseRes.rows[0] }, { status: 200 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error updating expense ${id}:`, error);
    if (error.message === 'Expense not found') {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
