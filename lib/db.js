import { Pool } from 'pg';

// Configuration de la connexion
const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Nécessaire pour certaines connexions SSL hébergées (comme Neon/Vercel)
      }
    }
  : {
      user: process.env.POSTGRES_USER || 'kipay',
      password: process.env.POSTGRES_PASSWORD || 'kipay',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'kipay',
    };

const pool = new Pool(connectionConfig);

// Fonction utilitaire pour exécuter des requêtes
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // Log en développement pour le debug
    if (process.env.NODE_ENV !== 'production') {
      console.log('executed query', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

// Fonction pour obtenir un client du pool (utile pour les transactions)
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};
