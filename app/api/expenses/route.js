import { getClient, query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sendNewExpenseEmail } from '@/lib/email';
import { logActivity } from '@/lib/activity';

// POST /api/expenses - Créer une nouvelle dépense
export async function POST(request) {
  const client = await getClient();
  try {
    const body = await request.json();
    const { description, amount, date, group_id, paid_by_user_id, participants, category } = body;

    if (!description || !amount || !group_id || !paid_by_user_id || !participants || participants.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const totalSplit = participants.reduce((sum, p) => sum + parseFloat(p.amount_owed), 0);
    if (Math.abs(totalSplit - parseFloat(amount)) > 0.05) {
      return NextResponse.json({ error: 'Split amounts do not match total amount' }, { status: 400 });
    }

    await client.query('BEGIN');

    const insertExpenseQuery = `
      INSERT INTO expenses (description, amount, date, group_id, paid_by_user_id, category)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, description, amount, date, category, created_at
    `;
    const expenseRes = await client.query(insertExpenseQuery, [description, amount, date || new Date(), group_id, paid_by_user_id, category || 'Autre']);
    const expense = expenseRes.rows[0];

    const insertParticipantQuery = `
      INSERT INTO expense_participants (expense_id, user_id, amount_owed)
      VALUES ($1, $2, $3)
    `;
    for (const p of participants) {
      await client.query(insertParticipantQuery, [expense.id, p.user_id, p.amount_owed]);
    }

    await client.query('COMMIT');

    // Log de l'activité
    await logActivity(group_id, paid_by_user_id, 'EXPENSE_CREATE', {
      expenseId: expense.id,
      description: expense.description,
      amount: expense.amount,
    });

    // Envoi des notifications
    try {
      const groupInfoRes = await query('SELECT name FROM groups WHERE id = $1', [group_id]);
      const groupName = groupInfoRes.rows[0].name;

      const membersRes = await query(`
        SELECT u.id, u.email, u.name, u.notify_new_expense 
        FROM users u
        JOIN group_members gm ON u.id = gm.user_id
        WHERE gm.group_id = $1
      `, [group_id]);

      const payer = membersRes.rows.find(m => m.id === paid_by_user_id);

      const recipients = membersRes.rows.filter(
        member => member.id !== paid_by_user_id && member.notify_new_expense
      );

      for (const recipient of recipients) {
        await sendNewExpenseEmail(recipient.email, {
          description,
          amount: parseFloat(amount),
          paidBy: payer.name,
          groupName,
          groupId: group_id,
        });
      }
    } catch (emailError) {
      console.error("Failed to send expense notification emails:", emailError);
    }

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
