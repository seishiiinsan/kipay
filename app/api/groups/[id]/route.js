import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/groups/:id - Obtenir les détails d'un groupe avec les soldes
export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const groupQuery = 'SELECT id, name, invite_code, created_by_user_id, created_at FROM groups WHERE id = $1';
    const groupRes = await query(groupQuery, [id]);

    if (groupRes.rows.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    const group = groupRes.rows[0];

    // Récupérer les membres
    const membersQuery = `
      SELECT u.id, u.name, u.email 
      FROM users u
      JOIN group_members gm ON u.id = gm.user_id
      WHERE gm.group_id = $1
    `;
    const membersRes = await query(membersQuery, [id]);
    const members = membersRes.rows;

    // Calculer les soldes pour chaque membre
    // On réutilise la logique de balance
    const balances = new Map(members.map(m => [m.id, 0]));

    // + Payé
    const paidRes = await query('SELECT paid_by_user_id, SUM(amount) as total FROM expenses WHERE group_id = $1 GROUP BY paid_by_user_id', [id]);
    paidRes.rows.forEach(row => balances.set(row.paid_by_user_id, (balances.get(row.paid_by_user_id) || 0) + parseFloat(row.total)));

    // - Dû
    const owedRes = await query(`
      SELECT ep.user_id, SUM(ep.amount_owed) as total 
      FROM expense_participants ep
      JOIN expenses e ON ep.expense_id = e.id
      WHERE e.group_id = $1
      GROUP BY ep.user_id
    `, [id]);
    owedRes.rows.forEach(row => balances.set(row.user_id, (balances.get(row.user_id) || 0) - parseFloat(row.total)));

    // + Remboursements faits
    const paymentsMadeRes = await query('SELECT paid_by_user_id, SUM(amount) as total FROM payments WHERE group_id = $1 GROUP BY paid_by_user_id', [id]);
    paymentsMadeRes.rows.forEach(row => balances.set(row.paid_by_user_id, (balances.get(row.paid_by_user_id) || 0) + parseFloat(row.total)));

    // - Remboursements reçus
    const paymentsReceivedRes = await query('SELECT paid_to_user_id, SUM(amount) as total FROM payments WHERE group_id = $1 GROUP BY paid_to_user_id', [id]);
    paymentsReceivedRes.rows.forEach(row => balances.set(row.paid_to_user_id, (balances.get(row.paid_to_user_id) || 0) - parseFloat(row.total)));

    // Associer le solde à chaque membre
    group.members = members.map(m => ({
      ...m,
      balance: balances.get(m.id) || 0
    }));

    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching group ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT /api/groups/:id - Mettre à jour un groupe
export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const text = 'UPDATE groups SET name = $1 WHERE id = $2 RETURNING id, name, created_at';
    const { rows } = await query(text, [name, id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json({ group: rows[0] }, { status: 200 });
  } catch (error) {
    console.error(`Error updating group ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE /api/groups/:id - Supprimer un groupe
export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    // 1. Vérifier si le groupe est équilibré
    const membersRes = await query('SELECT user_id FROM group_members WHERE group_id = $1', [id]);
    const memberIds = membersRes.rows.map(r => r.user_id);
    
    if (memberIds.length > 0) {
      const balances = new Map(memberIds.map(mid => [mid, 0]));

      const paidRes = await query('SELECT paid_by_user_id, SUM(amount) as total FROM expenses WHERE group_id = $1 GROUP BY paid_by_user_id', [id]);
      paidRes.rows.forEach(row => balances.set(row.paid_by_user_id, (balances.get(row.paid_by_user_id) || 0) + parseFloat(row.total)));

      const owedRes = await query(`
        SELECT ep.user_id, SUM(ep.amount_owed) as total 
        FROM expense_participants ep
        JOIN expenses e ON ep.expense_id = e.id
        WHERE e.group_id = $1
        GROUP BY ep.user_id
      `, [id]);
      owedRes.rows.forEach(row => balances.set(row.user_id, (balances.get(row.user_id) || 0) - parseFloat(row.total)));

      const paymentsMadeRes = await query('SELECT paid_by_user_id, SUM(amount) as total FROM payments WHERE group_id = $1 GROUP BY paid_by_user_id', [id]);
      paymentsMadeRes.rows.forEach(row => balances.set(row.paid_by_user_id, (balances.get(row.paid_by_user_id) || 0) + parseFloat(row.total)));

      const paymentsReceivedRes = await query('SELECT paid_to_user_id, SUM(amount) as total FROM payments WHERE group_id = $1 GROUP BY paid_to_user_id', [id]);
      paymentsReceivedRes.rows.forEach(row => balances.set(row.paid_to_user_id, (balances.get(row.paid_to_user_id) || 0) - parseFloat(row.total)));

      for (const [userId, balance] of balances) {
        if (Math.abs(balance) > 0.05) {
          return NextResponse.json({ error: 'Impossible de supprimer le groupe : tous les comptes ne sont pas soldés.' }, { status: 400 });
        }
      }
    }

    // 2. Supprimer le groupe
    const text = 'DELETE FROM groups WHERE id = $1 RETURNING *';
    const { rows } = await query(text, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Error deleting group ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
