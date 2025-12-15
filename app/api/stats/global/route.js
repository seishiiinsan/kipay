import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/stats/global - Obtenir des stats globales pour la landing page
export async function GET() {
  try {
    // On compte le nombre total de dépenses
    const { rows } = await query('SELECT COUNT(*) as count FROM expenses');
    const totalExpenses = parseInt(rows[0].count);

    return NextResponse.json({ totalExpenses }, { status: 200 });
  } catch (error) {
    console.error('Error fetching global stats:', error);
    // En cas d'erreur, on renvoie une valeur par défaut
    return NextResponse.json({ totalExpenses: 0 }, { status: 200 });
  }
}
