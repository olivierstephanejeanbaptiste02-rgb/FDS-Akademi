import db from '../config/database.js';

export const ProfessorModel = {
  findAll: async () => {
    const [rows] = await db.query("SELECT id, nom, prenom, email, axe, cree_le FROM utilisateurs WHERE role = 'professeur'");
    return rows;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM utilisateurs WHERE id = ? AND role = 'professeur'", [id]);
    return result;
  }
};