import * as attendanceService from '../services/attendance.service.js';

/**
 * Registrar asistencia mediante QR
 */
export async function scanQRAttendance(req, res) {
    try {
        const { qrToken } = req.body;
        const teacherId = req.user.id_user; // Del middleware de autenticación

        if (!qrToken) {
            return res.status(400).json({
                success: false,
                code: 'DATOS_INCOMPLETOS',
                message: 'El token QR es requerido'
            });
        }

        const result = await attendanceService.registerAttendance(qrToken, teacherId);

        return res.status(201).json({
            success: true,
            code: 'ASISTENCIA_REGISTRADA',
            message: 'Asistencia registrada exitosamente',
            data: result
        });

    } catch (error) {
        // Manejo de errores específicos
        if (error.message === 'QR_NO_ENCONTRADO') {
            return res.status(404).json({
                success: false,
                code: 'QR_NO_ENCONTRADO',
                message: 'El código QR no corresponde a ningún estudiante'
            });
        }

        if (error.message === 'ESTUDIANTE_INACTIVO') {
            return res.status(400).json({
                success: false,
                code: 'ESTUDIANTE_INACTIVO',
                message: 'El estudiante está inactivo en el sistema'
            });
        }

        if (error.message === 'YA_REGISTRADO') {
            return res.status(409).json({
                success: false,
                code: 'YA_REGISTRADO',
                message: 'Este estudiante ya registró su asistencia hoy'
            });
        }

        console.error('Error al registrar asistencia:', error);
        return res.status(500).json({
            success: false,
            code: 'ERROR_SERVIDOR',
            message: 'Error al registrar la asistencia'
        });
    }
}

/**
 * Obtener asistencias del día
 */
export async function getTodayAttendance(req, res) {
    try {
        const teacherId = req.query.teacherId || req.user.id_user;
        const attendances = await attendanceService.getTodayAttendanceList(teacherId);

        return res.status(200).json({
            success: true,
            data: attendances
        });

    } catch (error) {
        console.error('Error al obtener asistencias:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las asistencias'
        });
    }
}

/**
 * Agregar incidencia a una asistencia
 */
export async function addIncident(req, res) {
    try {
        const { attendanceId, comment } = req.body;

        if (!attendanceId || !comment) {
            return res.status(400).json({
                success: false,
                message: 'ID de asistencia y comentario son requeridos'
            });
        }

        const result = await attendanceService.addIncidentComment(attendanceId, comment);

        return res.status(200).json({
            success: true,
            message: 'Incidencia registrada exitosamente',
            data: result
        });

    } catch (error) {
        if (error.message === 'ASISTENCIA_NO_ENCONTRADA') {
            return res.status(404).json({
                success: false,
                message: 'Asistencia no encontrada'
            });
        }

        console.error('Error al agregar incidencia:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al agregar incidencia'
        });
    }
}
