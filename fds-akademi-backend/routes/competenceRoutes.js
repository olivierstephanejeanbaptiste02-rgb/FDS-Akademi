import express from 'express';
import { 
  createCompetence, 
  getMyCompetences, 
  getAllCompetences, 
  evaluateCompetence,
  getPublicCompetence // Importation du nouveau contrôleur
} from '../controllers/competenceController.js';
import { verifyToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', verifyToken, upload.single('fichier'), createCompetence);
router.get('/my', verifyToken, getMyCompetences);
router.get('/professor', verifyToken, getAllCompetences);
router.put('/:id/evaluate', verifyToken, evaluateCompetence);

// NOUVELLE ROUTE PUBLIQUE : Accessible sans authentification par les recruteurs
router.get('/shared/:token', getPublicCompetence);

export default router;