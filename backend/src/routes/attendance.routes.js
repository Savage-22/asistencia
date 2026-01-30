import { Router } from 'express';
import * as attendanceController from '../controllers/attendance.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const router = Router();

// Registrar asistencia (solo docentes)
router.post(
    '/scan',
    authenticateToken,
    authorizeRole('TEACHER', 'ADMIN'),
    attendanceController.scanQRAttendance
);

// Obtener asistencias del día
router.get(
    '/today',
    authenticateToken,
    authorizeRole('TEACHER', 'ADMIN'),
    attendanceController.getTodayAttendance
);

// Agregar incidencia
router.post(
    '/incident',
    authenticateToken,
    authorizeRole('TEACHER', 'ADMIN'),
    attendanceController.addIncident
);

export default router;
