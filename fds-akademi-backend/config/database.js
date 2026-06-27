import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuration utilisant l'URL de connexion complète ou les variables séparées
const dbConfig = process.env.DATABASE_URL 
  ? { uri: process.env.DATABASE_URL }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME, 
      port: parseInt(process.env.DB_PORT, 10) || 3306,
    };

const db = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // CONFIGURATION SSL OBLIGATOIRE POUR LA PRODUCTION
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

// Test de connexion au démarrage
if (process.env.NODE_ENV === 'production') {
  db.getConnection()
    .then(connection => {
      console.log('✅ Connexion MySQL avec Railway établie avec succès.');
      connection.release();
    })
    .catch(err => {
      console.error('❌ Échec de la connexion à la base de données Railway :', err.message);
    });
}

export default db;