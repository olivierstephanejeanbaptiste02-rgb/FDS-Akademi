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

// Liste des origines autorisées (Vite en local + Vercel en production)
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean); // Élimine les valeurs undefined si la variable d'environnement est absente

// Configuration des CORS sécurisée et robuste pour éviter les erreurs 500
app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (comme Postman ou les requêtes directes du serveur)
    if (!origin) return callback(null, true);
    
    // En mode développement, on est plus tolérant
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Nettoyage des slashes de fin pour éviter les faux négatifs de comparaison
    const cleanOrigin = origin.replace(/\/$/, "");
    const cleanFrontendUrl = (process.env.FRONTEND_URL || "").replace(/\/$/, "");

    if (allowedOrigins.includes(cleanOrigin) || cleanOrigin === cleanFrontendUrl) {
      return callback(null, true);
    } else {
      // On refuse proprement l'origine au lieu de faire planter le serveur Express
      return callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// Gestionnaire d'erreurs global pour intercepter les crashs imprévus du serveur
app.use((err, req, res, next) => {
  console.error('Erreur capturée par le middleware global:', err.stack);
  res.status(500).json({ 
    message: "Une erreur interne est survenue sur le serveur.",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// CRUCIAL POUR RENDER : Écouter sur le port fourni par l'environnement
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en ligne sur le port ${PORT}`);
});

export default app;