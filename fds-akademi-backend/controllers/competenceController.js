import { CompetenceModel } from '../models/competenceModel.js';
import crypto from 'crypto'; // REQUIS pour générer le token public unique

export const createCompetence = async (req, res) => {
  const { projet, description, github, professor_id } = req.body;
  const student_id = req.user.id;

  if (!projet || !description || !professor_id) {
    return res.status(400).json({ message: "Champs requis manquants (projet, description ou professor_id)." });
  }

  const fichier = req.file ? req.file.filename : null;

  try {
    await CompetenceModel.create({ student_id, projet, description, github, fichier, professor_id });
    res.status(201).json({ success: true, message: "Compétence soumise avec succès !" });
  } catch (error) {
    console.error("Erreur création compétence:", error);
    res.status(500).json({ message: "Erreur serveur lors de la soumission." });
  }
};

export const getMyCompetences = async (req, res) => {
  try {
    const results = await CompetenceModel.findByStudent(req.user.id);
    res.status(200).json(results);
  } catch (error) {
    console.error("Erreur récupération compétences étudiant:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération." });
  }
};

export const getAllCompetences = async (req, res) => {
  try {
    const professor_id = req.user.id;
    const results = await CompetenceModel.findAll(professor_id);
    res.status(200).json(results);
  } catch (error) {
    console.error("Erreur récupération toutes les compétences:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des dépôts." });
  }
};

// CORRECTION : Génération automatique du token public à la validation
export const evaluateCompetence = async (req, res) => {
  const { id } = req.params;
  const { status, commentaire } = req.body;

  const validStatuses = ['valide', 'rejete', 'en_attente'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: "Statut invalide. Utilisez 'valide', 'rejete' ou 'en_attente'." });
  }

  try {
    let publicToken = null;
    // Si le projet est validé, on lui attribue un token de partage unique
    if (status === 'valide') {
      publicToken = crypto.randomUUID();
    }

    const result = await CompetenceModel.updateStatus(id, status, commentaire || "", publicToken);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Projet introuvable." });
    }

    res.status(200).json({ 
      success: true, 
      message: `Projet mis à jour avec le statut : ${status}`,
      publicToken 
    });
  } catch (error) {
    console.error("Erreur lors de l'évaluation de la compétence:", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour de l'évaluation." });
  }
};

// AJOUT : Contrôleur pour la consultation publique du recruteur
export const getPublicCompetence = async (req, res) => {
  const { token } = req.params;
  try {
    const project = await CompetenceModel.findByToken(token);
    if (!project) {
      return res.status(404).json({ message: "Lien de partage invalide, expiré, ou projet non validé." });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error("Erreur récupération projet public:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du projet." });
  }
};