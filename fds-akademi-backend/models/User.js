import db from '../config/database.js';

export const UserModel = {
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
    return rows[0];
  },

  create: async (userData) => {
    const { nom, prenom, email, hashedPassword, role, axe, niveau } = userData;
    const query = `
      INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role, axe, niveau) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [nom, prenom, email, hashedPassword, role, axe, niveau]);
    return result;
  }
};