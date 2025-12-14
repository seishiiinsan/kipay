import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/groups/:id/stats - Obtenir les statistiques d'un groupe
export async function GET(request, { params }) {
  const { id: groupId } = await params;
  try {
    // 1. Total dépensé par membre
    const totalSpentPerMemberQuery = `
      SELECT u.name, COALESCE(SUM(e.amount), 0) as total_spent
      FROM users u
      JOIN expenses e ON u.id = e.paid_by_user_id
      WHERE e.group_id = $1
      GROUP BY u.name
      ORDER BY total_spent DESC;
    `;
    const totalSpentPerMemberRes = await query(totalSpentPerMemberQuery, [groupId]);

    // 2. Dépenses par mois
    const expensesByMonthQuery = `
      SELECT 
        TO_CHAR(date, 'YYYY-MM') as month,
        COUNT(*) as expense_count,
        SUM(amount) as total_amount
      FROM expenses
      WHERE group_id = $1
      GROUP BY month
      ORDER BY month ASC;
    `;
    const expensesByMonthRes = await query(expensesByMonthQuery, [groupId]);

    // 3. Plus grosses dépenses
    const biggestExpensesQuery = `
      SELECT id, description, amount, date
      FROM expenses
      WHERE group_id = $1
      ORDER BY amount DESC
      LIMIT 5;
    `;
    const biggestExpensesRes = await query(biggestExpensesQuery, [groupId]);

    // 4. Total par catégorie
    const totalByCategoryQuery = `
      SELECT category, COALESCE(SUM(amount), 0) as total_amount
      FROM expenses
      WHERE group_id = $1
      GROUP BY category
      ORDER BY total_amount DESC;
    `;
    const totalByCategoryRes = await query(totalByCategoryQuery, [groupId]);

    return NextResponse.json({
      stats: {
        totalSpentPerMember: totalSpentPerMemberRes.rows,
        expensesByMonth: expensesByMonthRes.rows,
        biggestExpenses: biggestExpensesRes.rows,
        totalByCategory: totalByCategoryRes.rows,
      }
    }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching stats for group ${groupId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
