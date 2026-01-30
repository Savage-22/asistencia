import apiClient from './api.js';

/**
 * Registrar asistencia mediante escaneo QR
 * @param {string} qrToken - Token del código QR escaneado
 * @returns {Promise<Object>} - Resultado del registro
 */
export async function scanAttendance(qrToken) {
    try {
        const response = await apiClient.post('/attendance/scan', { qrToken });
        return response.data;
    } catch (error) {
        if (error.response?.data?.code) {
            throw error.response.data.code;
        }
        throw 'Error al registrar asistencia';
    }
}

/**
 * Obtener asistencias del día actual
 * @returns {Promise<Array>} - Lista de asistencias
 */
export async function getTodayAttendance() {
    try {
        const response = await apiClient.get('/attendance/today');
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error al obtener asistencias';
    }
}
