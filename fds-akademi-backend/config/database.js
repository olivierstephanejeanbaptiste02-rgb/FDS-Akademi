import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// En production sur Render, process.env.DATABASE_URL est souvent fourni par Railway 
// sous forme de chaîne unique (URL). Si vous préférez utiliser les variables séparées, voici la config idéale :
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
  port: parseInt(process.env.DB_PORT) || 3306, // Convertit le port en nombre
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;