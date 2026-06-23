import express from 'express';
import { createAnnouncement, getStudentAnnouncements } from '../controllers/announcementController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/', verifyToken, requireRole(['admin', 'professeur']), createAnnouncement);
router.get('/student-feed', verifyToken, requireRole(['etudiant']), getStudentAnnouncements);

export default router;