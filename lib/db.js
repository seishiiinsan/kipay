import { Pool } from 'pg';

// Fonction pour trouver l'URL de connexion disponible
const getConnectionString = () => {
  // Liste des variables d'environnement possibles pour l'URL de la base de données
  // On cherche d'abord les variables standard, puis celles spécifiques à Neon/Vercel, puis celles avec le préfixe du projet
  const possibleKeys = [
    'DATABASE_URL',
    'POSTGRES_URL',
    'kipay_DATABASE_URL',
    'kipay_POSTGRES_URL',
    'kipay_POSTGRES_URL_NON_POOLING'
  ];

  for (const key of possibleKeys) {
    if (process.env[key]) {
      console.log(`Using database connection from env var: ${key}`);
      return process.env[key];
    }
  }
  
  return null;
};

const connectionString = getConnectionString();

// Configuration de la connexion
const connectionConfig = connectionString
  ? {
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false // Nécessaire pour Neon/Vercel
      }
    }
  : {
      // Fallback pour le développement local sans URL complète
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
