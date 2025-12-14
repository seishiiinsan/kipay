import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sendDebtReminderEmail } from '@/lib/email';

export async function GET(request) {
  // 1. Sécuriser l'endpoint
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // 2. Récupérer les utilisateurs qui veulent des rappels
    const usersToNotifyRes = await query('SELECT id, name, email FROM users WHERE notify_debt_reminder = TRUE');
    const usersToNotify = usersToNotifyRes.rows;

    let emailsSent = 0;

    // 3. Pour chaque utilisateur, calculer son solde global
    for (const user of usersToNotify) {
      const totalPaidRes = await query('SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE paid_by_user_id = $1', [user.id]);
      let netBalance = parseFloat(totalPaidRes.rows[0].total);

      const totalOwedRes = await query('SELECT COALESCE(SUM(amount_owed), 0) as total FROM expense_participants WHERE user_id = $1', [user.id]);
      netBalance -= parseFloat(totalOwedRes.rows[0].total);

      const paymentsMadeRes = await query('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE paid_by_user_id = $1', [user.id]);
      netBalance += parseFloat(paymentsMadeRes.rows[0].total);

      const paymentsReceivedRes = await query('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE paid_to_user_id = $1', [user.id]);
      netBalance -= parseFloat(paymentsReceivedRes.rows[0].total);

      // 4. Si l'utilisateur a une dette significative, envoyer l'email
      if (netBalance < -5.00) { // On envoie seulement si la dette est > 5€
        const totalDebt = -netBalance;
        await sendDebtReminderEmail(user.email, totalDebt, user.name);
        emailsSent++;
      }
    }

    return NextResponse.json({ success: true, emailsSent });
  } catch (error) {
    console.error('Cron job failed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
