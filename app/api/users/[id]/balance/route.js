import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/users/:id/balance - Obtenir le solde global d'un utilisateur
export async function GET(request, { params }) {
  const { id } = await params;
  try {
    // 1. Total payé par l'utilisateur dans toutes les dépenses
    const totalPaidRes = await query('SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE paid_by_user_id = $1', [id]);
    let netBalance = parseFloat(totalPaidRes.rows[0].total);

    // 2. Total de toutes ses parts de dépenses (ce qu'il aurait dû payer)
    const totalOwedRes = await query('SELECT COALESCE(SUM(amount_owed), 0) as total FROM expense_participants WHERE user_id = $1', [id]);
    netBalance -= parseFloat(totalOwedRes.rows[0].total);

    // 3. Total des remboursements faits par l'utilisateur
    // Un remboursement fait est une sortie d'argent, comme payer une dépense. Cela augmente le solde (réduit la dette).
    const paymentsMadeRes = await query('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE paid_by_user_id = $1', [id]);
    netBalance += parseFloat(paymentsMadeRes.rows[0].total); // CORRECTION : + au lieu de -

    // 4. Total des remboursements reçus par l'utilisateur
    // Un remboursement reçu est une entrée d'argent. Cela diminue le solde (réduit la créance).
    const paymentsReceivedRes = await query('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE paid_to_user_id = $1', [id]);
    netBalance -= parseFloat(paymentsReceivedRes.rows[0].total); // CORRECTION : - au lieu de +

    // Maintenant, on sépare ce solde net en "On vous doit" et "Vous devez"
    let totalOwedToUser = 0;
    let totalUserOwes = 0;

    if (netBalance > 0) {
      totalOwedToUser = netBalance;
    } else {
      totalUserOwes = -netBalance;
    }

    return NextResponse.json({
      balance: {
        totalOwedToUser,
        totalUserOwes,
        netBalance,
      }
    }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching balance for user ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
