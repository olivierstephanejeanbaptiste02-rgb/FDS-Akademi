import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { ProfessorModel } from '../models/Professor.js';

export const registerProfessor = async (req, res) => {
  const { nom, prenom, email, password, axe } = req.body;
  try {
    const exists = await UserModel.findByEmail(email);
    if (exists) return res.status(400).json({ message: 'Cet email est déjà pris.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await UserModel.create({ nom, prenom, email, hashedPassword, role: 'professeur', axe, niveau: 'Tous les niveaux' });
    res.status(201).json({ success: true, message: 'Professeur créé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur création professeur.' });
  }
};

export const getAllProfessors = async (req, res) => {
  try {
    const professors = await ProfessorModel.findAll();
    res.status(200).json(professors);
  } catch (error) {
    res.status(500).json({ message: 'Erreur de récupération.' });
  }
};