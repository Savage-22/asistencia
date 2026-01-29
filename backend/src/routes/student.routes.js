import { Router } from 'express';
import * as studentController from '../controllers/student.controller.js';

const router = Router();

/**
 * STUDENT ROUTES
 * Define los endpoints de la API de estudiantes
 */

// GET /students - Obtener todos los estudiantes
router.get('/', studentController.getAllStudents);

// GET /students/:id - Obtener estudiante por ID
router.get('/:id', studentController.getStudentById);

// GET /students/:id/qr - Generar imagen QR del estudiante
router.get('/:id/qr', studentController.getStudentQRImage);

// POST /students - Crear nuevo estudiante
router.post('/', studentController.createStudent);

export default router;
