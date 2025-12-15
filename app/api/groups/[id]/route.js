import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/groups/:id - Obtenir un groupe spécifique avec ses membres et leurs soldes
export async function GET(request, { params }) {
  const { id: groupId } = await params;
  try {
    // 1. Récupérer les infos de base du groupe
    const groupRes = await query('SELECT * FROM groups WHERE id = $1', [groupId]);
    if (groupRes.rows.length === 0) {
      return NextResponse.json({ error: 'Groupe non trouvé' }, { status: 404 });
    }
    const group = groupRes.rows[0];

    // 2. Récupérer les membres du groupe
    const membersRes = await query(`
      SELECT u.id, u.name, u.email, u.avatar_variant, u.avatar_palette
      FROM users u
      JOIN group_members gm ON u.id = gm.user_id
      WHERE gm.group_id = $1
    `, [groupId]);
    const members = membersRes.rows;

    // 3. Calculer les soldes pour chaque membre
    for (const member of members) {
      const totalPaidRes = await query('SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE group_id = $1 AND paid_by_user_id = $2', [groupId, member.id]);
      let balance = parseFloat(totalPaidRes.rows[0].total);

      const totalOwedRes = await query('SELECT COALESCE(SUM(amount_owed), 0) as total FROM expense_participants WHERE expense_id IN (SELECT id FROM expenses WHERE group_id = $1) AND user_id = $2', [groupId, member.id]);
      balance -= parseFloat(totalOwedRes.rows[0].total);
      
      const paymentsMadeRes = await query('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE group_id = $1 AND paid_by_user_id = $2', [groupId, member.id]);
      balance += parseFloat(paymentsMadeRes.rows[0].total);

      const paymentsReceivedRes = await query('SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE group_id = $1 AND paid_to_user_id = $2', [groupId, member.id]);
      balance -= parseFloat(paymentsReceivedRes.rows[0].total);

      member.balance = balance;
    }

    group.members = members;

    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching group ${groupId}:`, error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
