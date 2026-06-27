import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importation des fichiers de routes spécifiques
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import professorRoutes from './routes/professorRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import competenceRoutes from './routes/competenceRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuration des CORS sécurisée pour la production
const allowedOrigins = [
  'http://localhost:5173', // Pour vos tests en local avec Vite
  process.env.FRONTEND_URL  // L'URL définitive de votre frontend Vercel
];

app.use(cors({
  origin: function (origin, callback) {
    // Permet les requêtes sans origine (comme les outils Postman ou les applications mobiles)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    } else {
      return callback(new Error('Bloqué par les restrictions CORS de production'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Rendre le dossier 'uploads' public
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Points d'ancrage modulaires de l'API RESTful
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/competences', competenceRoutes);

app.get('/', (req, res) => {
  res.send('Serveur API FDS Akademi opérationnel 🚀');
});

// CRUCIAL POUR RENDER : Écouter sur le port fourni par l'environnement
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});

export default app;