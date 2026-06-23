import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun jeton fourni.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'FDS_SECRET_KEY_2026');
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Jeton de sécurité invalide ou expiré.' });
  }
};