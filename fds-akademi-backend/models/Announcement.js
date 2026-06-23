import db from '../config/database.js';

export const AnnouncementModel = {
  create: async (data) => {
    const { titre, message, axe, niveau, auteur_id } = data;
    const query = `
      INSERT INTO annonces (titre, message, cible_axe, cible_niveau, auteur_id) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [titre, message, axe, niveau, auteur_id]);
    return result;
  },

  findForStudent: async (axe, niveau) => {
    const query = `
      SELECT * FROM annonces 
      WHERE (cible_axe = ? OR cible_axe = 'Tous les axes')
        AND (cible_niveau = ? OR cible_niveau = 'Tous les niveaux')
      ORDER BY cree_le DESC
    `;
    const [rows] = await db.query(query, [axe, niveau]);
    return rows;
  }
};