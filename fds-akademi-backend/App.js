import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url'; // Requis pour recréer __dirname en ES Modules

// Importation des fichiers de routes spécifiques
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import professorRoutes from './routes/professorRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import competenceRoutes from './routes/competenceRoutes.js';

// Configuration de __dirname pour le mode ES Module (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(cors({
  origin: 'https://fds-akademi-frontend.vercel.app', // Remplace par l'URL exacte de ton Vercel
  credentials: true
}));
app.use(express.json());

// Rendre le dossier 'uploads' public avec un chemin absolu robuste
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

export default app;