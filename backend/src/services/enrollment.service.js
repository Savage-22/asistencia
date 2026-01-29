import * as enrollmentModel from '../models/enrollment.model.js';

/**
 * Servicio de matrícula conjunta
 */
export const enrollStudent = async (enrollmentData) => {
    // Validaciones
    if (!enrollmentData.student?.first_name || !enrollmentData.student?.last_name) {
        throw new Error('Nombre y apellido del estudiante son requeridos');
    }
    
    if (!enrollmentData.student?.id_section) {
        throw new Error('Debe seleccionar una sección');
    }
    
    if (!enrollmentData.parent?.first_name || !enrollmentData.parent?.last_name) {
        throw new Error('Nombre y apellido del apoderado son requeridos');
    }
    
    if (!enrollmentData.parent?.phone) {
        throw new Error('Teléfono del apoderado es requerido');
    }
    
    // Validar formato de teléfono (básico)
    if (!/^\d{9,15}$/.test(enrollmentData.parent.phone.replace(/\s/g, ''))) {
        throw new Error('Formato de teléfono inválido');
    }
    
    return await enrollmentModel.enrollStudentWithParent(enrollmentData);
};

/**
 * Obtener todas las secciones
 */
export const getAllSections = async () => {
    return await enrollmentModel.getAllSections();
};
