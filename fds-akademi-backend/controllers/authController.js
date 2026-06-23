import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Identifiants incorrects.' });

    const isMatch = await bcrypt.compare(password, user.mot_de_passe);
    if (!isMatch) return res.status(401).json({ message: 'Identifiants incorrects.' });

    const token = jwt.sign(
      { id: user.id, role: user.role, axe: user.axe, niveau: user.niveau },
      process.env.JWT_SECRET || 'FDS_SECRET_KEY_2026',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token,
      user: { id: user.id, nom: user.nom, prenom: user.prenom, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur d\'authentification.' });
  }
};