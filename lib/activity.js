import { query } from '@/lib/db';

export async function logActivity(groupId, userId, type, details) {
  try {
    const text = `
      INSERT INTO activities (group_id, user_id, type, details)
      VALUES ($1, $2, $3, $4)
    `;
    await query(text, [groupId, userId, type, JSON.stringify(details)]);
  } catch (error) {
    console.error('Failed to log activity:', error);
    // On ne bloque pas l'application si le log échoue
  }
}
