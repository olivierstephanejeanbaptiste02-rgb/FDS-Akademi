import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du pool de connexions MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  
  // CONFIGURATION SSL CRUCIALE POUR LA PRODUCTION
  // On active le SSL de manière sécurisée uniquement si on est en production
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
});

// Test rapide de connexion pour voir les erreurs directement dans les logs au démarrage
if (process.env.NODE_ENV === 'production') {
  db.getConnection()
    .then(connection => {
      console.log('✅ Connexion MySQL avec Railway établie avec succès via SSL.');
      connection.release();
    })
    .catch(err => {
      console.error('❌ Échec de la connexion à la base de données Railway :', err.message);
    });
}

export default db;