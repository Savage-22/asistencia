import * as enrollmentService from '../services/enrollment.service.js';

/**
 * Matricular estudiante con apoderado
 * POST /api/enrollment
 */
export const enrollStudent = async (req, res) => {
    try {
        const enrollmentData = req.body;
        const result = await enrollmentService.enrollStudent(enrollmentData);
        
        res.status(201).json({
            success: true,
            message: 'Estudiante matriculado exitosamente',
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Obtener todas las secciones
 * GET /api/enrollment/sections
 */
export const getSections = async (req, res) => {
    try {
        const sections = await enrollmentService.getAllSections();
        
        res.status(200).json({
            success: true,
            data: sections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
