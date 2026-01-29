import { Router } from 'express';
import * as teacherController from '../controllers/teacher.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * TEACHER ROUTES
 * Rutas para gestión de docentes
 */

// GET /teachers - Obtener todos los docentes (ADMIN o TEACHER pueden ver)
router.get('/', authenticateToken, teacherController.getAllTeachers);

// GET /teachers/:id - Obtener docente por ID
router.get('/:id', authenticateToken, teacherController.getTeacherById);

// POST /teachers - Crear nuevo docente (Solo ADMIN)
router.post('/', authenticateToken, authorizeRole('ADMIN'), teacherController.createTeacher);

// POST /teachers/:id/sections - Asignar secciones a docente (Solo ADMIN)
router.post('/:id/sections', authenticateToken, authorizeRole('ADMIN'), teacherController.assignSections);

// DELETE /teachers/:id/sections/:sectionId - Eliminar asignación (Solo ADMIN)
router.delete('/:id/sections/:sectionId', authenticateToken, authorizeRole('ADMIN'), teacherController.removeSection);

// GET /teachers/:id/students - Obtener estudiantes del docente
router.get('/:id/students', authenticateToken, teacherController.getTeacherStudents);

export default router;
