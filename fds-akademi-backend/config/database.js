import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'reseau.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'OLKtfPGsbaphUAjulfzCcOyKXfDAebrz',
  database: process.env.DB_NAME || 'railway', // Attention, le nom est bien 'railway' en ligne
  port: process.env.DB_PORT || 22450, // Ajoute cette ligne pour gérer le port public de Railway
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;