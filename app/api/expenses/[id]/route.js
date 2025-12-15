import { query, getClient } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/api-auth';
import { logActivity } from '@/lib/activity';

// GET (inchangé)
export async function GET(request, { params }) {
  // ... (code existant)
}

// DELETE
export async function DELETE(request, { params }) {
  const { id } = await params;
  const client = await getClient();
  try {
    const currentUserId = await getUserIdFromRequest(request);
    if (!currentUserId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    await client.query('BEGIN');
    
    const expenseRes = await client.query('SELECT paid_by_user_id, group_id, description FROM expenses WHERE id = $1', [id]);
    if (expenseRes.rows.length === 0) return NextResponse.json({ error: 'Dépense non trouvée' }, { status: 404 });
    
    const expense = expenseRes.rows[0];
    if (String(expense.paid_by_user_id) !== String(currentUserId)) {
      return NextResponse.json({ error: 'Seul le créateur peut supprimer cette dépense' }, { status: 403 });
    }

    await client.query('DELETE FROM expenses WHERE id = $1', [id]);
    
    // Log de l'activité
    await logActivity(expense.group_id, currentUserId, 'EXPENSE_DELETE', {
      description: expense.description,
    });

    await client.query('COMMIT');

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error deleting expense ${id}:`, error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  } finally {
    client.release();
  }
}

// PUT
export async function PUT(request, { params }) {
  const { id } = await params;
  const client = await getClient();
  try {
    const currentUserId = await getUserIdFromRequest(request);
    if (!currentUserId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const body = await request.json();
    const { description, amount, date, paid_by_user_id, participants, category } = body;

    if (!description || !amount || !participants || participants.length === 0) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    await client.query('BEGIN');

    const expenseCheckRes = await client.query('SELECT paid_by_user_id, group_id FROM expenses WHERE id = $1', [id]);
    if (expenseCheckRes.rows.length === 0) return NextResponse.json({ error: 'Dépense non trouvée' }, { status: 404 });
    
    const expense = expenseCheckRes.rows[0];
    if (String(expense.paid_by_user_id) !== String(currentUserId)) {
      return NextResponse.json({ error: 'Seul le créateur peut modifier cette dépense' }, { status: 403 });
    }

    const updateExpenseQuery = `
      UPDATE expenses 
      SET description = $1, amount = $2, date = $3, paid_by_user_id = $4, category = $5
      WHERE id = $6
      RETURNING *
    `;
    const updatedExpenseRes = await client.query(updateExpenseQuery, [description, amount, date, paid_by_user_id, category, id]);

    await client.query('DELETE FROM expense_participants WHERE expense_id = $1', [id]);

    const insertParticipantQuery = `INSERT INTO expense_participants (expense_id, user_id, amount_owed) VALUES ($1, $2, $3)`;
    for (const p of participants) {
      await client.query(insertParticipantQuery, [id, p.user_id, p.amount_owed]);
    }

    // Log de l'activité
    await logActivity(expense.group_id, currentUserId, 'EXPENSE_UPDATE', {
      expenseId: id,
      description: description,
      amount: amount,
    });

    await client.query('COMMIT');

    return NextResponse.json({ expense: updatedExpenseRes.rows[0] }, { status: 200 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error updating expense ${id}:`, error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  } finally {
    client.release();
  }
}
