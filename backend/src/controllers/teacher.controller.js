import * as teacherService from '../services/teacher.service.js';

/**
 * Crear un nuevo docente
 * POST /teachers
 */
export const createTeacher = async (req, res) => {
    try {
        const teacherData = req.body;
        const newTeacher = await teacherService.createTeacher(teacherData);
        
        res.status(201).json({
            success: true,
            message: 'Docente creado exitosamente',
            data: newTeacher
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Obtener todos los docentes
 * GET /teachers
 */
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await teacherService.getAllTeachers();
        
        res.status(200).json({
            success: true,
            count: teachers.length,
            data: teachers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Obtener docente por ID
 * GET /teachers/:id
 */
export const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await teacherService.getTeacherById(id);
        
        res.status(200).json({
            success: true,
            data: teacher
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Asignar secciones a un docente
 * POST /teachers/:id/sections
 */
export const assignSections = async (req, res) => {
    try {
        const { id } = req.params;
        const { section_ids } = req.body;
        
        const result = await teacherService.assignSections(id, section_ids);
        
        res.status(200).json({
            success: true,
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
 * Eliminar asignación de sección
 * DELETE /teachers/:id/sections/:sectionId
 */
export const removeSection = async (req, res) => {
    try {
        const { id, sectionId } = req.params;
        const result = await teacherService.removeSection(id, sectionId);
        
        res.status(200).json({
            success: true,
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
 * Obtener estudiantes del docente
 * GET /teachers/:id/students
 */
export const getTeacherStudents = async (req, res) => {
    try {
        const { id } = req.params;
        const students = await teacherService.getTeacherStudents(id);
        
        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
