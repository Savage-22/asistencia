import { Router } from 'express';
import * as studentController from '../controllers/student.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * STUDENT ROUTES
 * Define los endpoints de la API de estudiantes
 * Todas las rutas están protegidas - requieren token JWT
 */

// GET /students - Obtener todos los estudiantes (PROTEGIDA)
router.get('/', authenticateToken, studentController.getAllStudents);

// GET /students/:id - Obtener estudiante por ID (PROTEGIDA)
router.get('/:id', authenticateToken, studentController.getStudentById);

// GET /students/:id/qr - Generar imagen QR del estudiante (PROTEGIDA)
router.get('/:id/qr', authenticateToken, studentController.getStudentQRImage);

// POST /students - Crear nuevo estudiante (PROTEGIDA)
router.post('/', authenticateToken, studentController.createStudent);

export default router;
