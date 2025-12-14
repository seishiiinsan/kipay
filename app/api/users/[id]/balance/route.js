import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/users/:id/balance - Obtenir le solde global d'un utilisateur
export async function GET(request, { params }) {
  const { id } = params;
  try {
    // Calcul de ce que l'utilisateur a payé pour les autres
    const totalPaidForOthersQuery = `
      SELECT COALESCE(SUM(ep.amount_owed), 0) as total
      FROM expenses e
      JOIN expense_participants ep ON e.id = ep.expense_id
      WHERE e.paid_by_user_id = $1 AND ep.user_id != $1 AND ep.is_settled = FALSE;
    `;
    const totalPaidForOthersResult = await query(totalPaidForOthersQuery, [id]);
    const totalOwedToUser = parseFloat(totalPaidForOthersResult.rows[0].total);

    // Calcul de ce que les autres ont payé pour l'utilisateur
    const totalPaidByOthersQuery = `
      SELECT COALESCE(SUM(ep.amount_owed), 0) as total
      FROM expenses e
      JOIN expense_participants ep ON e.id = ep.expense_id
      WHERE e.paid_by_user_id != $1 AND ep.user_id = $1 AND ep.is_settled = FALSE;
    `;
    const totalPaidByOthersResult = await query(totalPaidByOthersQuery, [id]);
    const totalUserOwes = parseFloat(totalPaidByOthersResult.rows[0].total);

    // Calcul du solde net
    const netBalance = totalOwedToUser - totalUserOwes;

    return NextResponse.json({
      balance: {
        totalOwedToUser, // Ce que les autres doivent à l'utilisateur
        totalUserOwes,   // Ce que l'utilisateur doit aux autres
        netBalance,      // Solde net (positif si on lui doit de l'argent, négatif s'il en doit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching balance for user ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
