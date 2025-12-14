import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// Fonction pour convertir un tableau d'objets en CSV
function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      let value = row[header];
      if (typeof value === 'string') {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\\n');
}

// GET /api/groups/:id/export - Exporter les dépenses d'un groupe en CSV
export async function GET(request, { params }) {
  const { id: groupId } = await params; // Correction : await params
  try {
    const expensesQuery = `
      SELECT 
        e.id as expense_id,
        e.description,
        e.amount,
        e.date,
        u.name as paid_by
      FROM expenses e
      JOIN users u ON e.paid_by_user_id = u.id
      WHERE e.group_id = $1
      ORDER BY e.date ASC;
    `;
    const { rows: expenses } = await query(expensesQuery, [groupId]);

    if (expenses.length === 0) {
      return NextResponse.json({ error: 'No expenses to export' }, { status: 404 });
    }

    const csvData = convertToCSV(expenses);
    const groupName = 'kipay-export';
    const filename = `${groupName}-${new Date().toISOString().split('T')[0]}.csv`;

    const response = new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

    return response;
  } catch (error) {
    console.error(`Error exporting data for group ${groupId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
