import db from '../config/database.js';

export const StudentModel = {
  findAll: async () => {
    const [rows] = await db.query("SELECT id, nom, prenom, email, axe, niveau, cree_le FROM utilisateurs WHERE role = 'etudiant'");
    return rows;
  },
  
  delete: async (id) => {
    const [result] = await db.query("DELETE FROM utilisateurs WHERE id = ? AND role = 'etudiant'", [id]);
    return result;
  }
};