import apiClient from './api.js';


//Matricular estudiante con apoderado
export const enrollStudent = async (enrollmentData) => {
    try {
        const response = await apiClient.post('/enrollment', enrollmentData);
        return response.data.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data.message || 'Error al matricular estudiante';
        }
        throw 'No se pudo conectar con el servidor';
    }
};


//Obtener todas las secciones
export const getSections = async () => {
    try {
        const response = await apiClient.get('/enrollment/sections');
        return response.data.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data.message || 'Error al obtener secciones';
        }
        throw 'No se pudo conectar con el servidor';
    }
};
