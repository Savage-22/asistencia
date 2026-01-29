import apiClient from './api.js';

/**
 * Servicio para manejar estudiantes
 */

/**
 * Obtener todos los estudiantes
 * @returns {Promise<Array>} Lista de estudiantes
 */
export const getAllStudents = async () => {
    try {
        const response = await apiClient.get('/students');
        return response.data.data; // Retorna el array de estudiantes
    } catch (error) {
        if (error.response) {
            throw error.response.data.message || 'Error al obtener estudiantes';
        }
        throw 'No se pudo conectar con el servidor';
    }
};

/**
 * Obtener la imagen QR de un estudiante
 * @param {string} studentId - ID del estudiante
 * @returns {Promise<Object>} Datos del QR (imagen en base64)
 */
export const getStudentQR = async (studentId) => {
    try {
        const response = await apiClient.get(`/students/${studentId}/qr`);
        return response.data.data; // { id_student, name, qr_token, qr_image }
    } catch (error) {
        if (error.response) {
            throw error.response.data.message || 'Error al obtener QR';
        }
        throw 'No se pudo conectar con el servidor';
    }
};
