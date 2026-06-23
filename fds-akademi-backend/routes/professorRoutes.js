import express from 'express';
import { registerProfessor, getAllProfessors } from '../controllers/professorController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/', verifyToken, requireRole(['admin']), registerProfessor);
router.get('/', verifyToken, requireRole(['admin','etudiant']), getAllProfessors);

export default router;