import db from '../config/database.js';

export const CompetenceModel = {
  create: async (data) => {
    const { student_id, projet, description, github, fichier, professor_id } = data;
    const query = `
      INSERT INTO competences (student_id, projet, description, github, fichier, professor_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [student_id, projet, description, github, fichier, professor_id]);
    return result;
  },

  findByStudent: async (studentId) => {
    const query = `
      SELECT c.*, u.nom AS prof_nom, u.prenom AS prof_prenom 
      FROM competences c
      LEFT JOIN utilisateurs u ON c.professor_id = u.id
      WHERE c.student_id = ? 
      ORDER BY c.created_at DESC
    `;
    const [rows] = await db.query(query, [studentId]);
    return rows;
  },

  findAll: async (professorId) => {
    const query = `
      SELECT c.*, u.nom AS prof_nom, u.prenom AS prof_prenom 
      FROM competences c
      LEFT JOIN utilisateurs u ON c.professor_id = u.id
      WHERE c.professor_id = ?
      ORDER BY c.created_at DESC
    `;
    const [rows] = await db.query(query, [professorId]);
    return rows;
  },

  // AJOUT ET CORRECTION ICI : Gestion du public_token + stockage du commentaire au bon endroit
  updateStatus: async (id, status, commentaire, publicToken = null) => {
    const query = `
      UPDATE competences 
      SET status = ?, commentaire = ?, public_token = ?
      WHERE id = ?
    `;
    const [result] = await db.query(query, [status, commentaire, publicToken, id]);
    return result;
  },

  // AJOUT : Rechercher un projet via son jeton public (jointure avec l'étudiant)
  findByToken: async (token) => {
    const query = `
      SELECT c.*, 
             u1.nom AS nom_etudiant, u1.prenom AS prenom_etudiant,
             u2.nom AS prof_nom, u2.prenom AS prof_prenom
      FROM competences c
      LEFT JOIN utilisateurs u1 ON c.student_id = u1.id
      LEFT JOIN utilisateurs u2 ON c.professor_id = u2.id
      WHERE c.public_token = ? AND c.status = 'valide'
    `;
    const [rows] = await db.query(query, [token]);
    return rows[0]; // Retourne le projet ou undefined s'il n'existe pas
  }
};