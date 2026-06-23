import express from 'express';
import { registerStudent, getAllStudents } from '../controllers/studentController.js';
import { verifyToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/', verifyToken, requireRole(['admin']), registerStudent);
router.get('/', verifyToken, requireRole(['admin', 'professeur']), getAllStudents);

export default router;