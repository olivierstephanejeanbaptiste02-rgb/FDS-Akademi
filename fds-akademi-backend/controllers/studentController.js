import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { StudentModel } from '../models/Student.js';

export const registerStudent = async (req, res) => {
  const { nom, prenom, email, password, axe, niveau } = req.body;
  try {
    const exists = await UserModel.findByEmail(email);
    if (exists) return res.status(400).json({ message: 'Cet email est déjà pris.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await UserModel.create({ nom, prenom, email, hashedPassword, role: 'etudiant', axe, niveau });
    res.status(201).json({ success: true, message: 'Étudiant créé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'étudiant.' });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await StudentModel.findAll();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Erreur de récupération.' });
  }
};