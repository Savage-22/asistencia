import { Router } from 'express';
import * as enrollmentController from '../controllers/enrollment.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * ENROLLMENT ROUTES
 * Rutas para matrícula de estudiantes
 * Solo ADMIN puede matricular
 */

// GET /enrollment/sections - Obtener todas las secciones
router.get('/sections', authenticateToken, enrollmentController.getSections);

// POST /enrollment - Matricular estudiante con apoderado
router.post('/', authenticateToken, authorizeRole('ADMIN'), enrollmentController.enrollStudent);

export default router;
