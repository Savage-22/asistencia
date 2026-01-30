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

export default router;
