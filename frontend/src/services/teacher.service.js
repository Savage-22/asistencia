import apiClient from './api.js';

//Crear un docente
export const createTeacher = async (teacherData) => {
    try {
        const response = await apiClient.post('/teachers', teacherData);
        return response.data.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data.message || 'Error al crear docente';
        }
        throw 'No se pudo conectar con el servidor';
    }
};

//Obtener todos los docentes
export const getAllTeachers = async () => {
    try {
        const response = await apiClient.get('/teachers');
        return response.data.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data.message || 'Error al obtener docentes';
        }
        throw 'No se pudo conectar con el servidor';
    }
};

//Obtener docente por ID
export const getTeacherById = async (id) => {
    try {
        const response = await apiClient.get(`/teachers/${id}`);
        return response.data.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data.message || 'Error al obtener docente';
        }
        throw 'No se pudo conectar con el servidor';
    }
};

//Asignar secciones a un docente
export const assignSections = async (teacherId, sectionIds) => {
    try {
        const response = await apiClient.post(`/teachers/${teacherId}/sections`, {
            section_ids: sectionIds
        });
        return response.data.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data.message || 'Error al asignar secciones';
        }
        throw 'No se pudo conectar con el servidor';
    }
};

//Eliminar asignación de sección
export const removeSection = async (teacherId, sectionId) => {
    try {
        const response = await apiClient.delete(`/teachers/${teacherId}/sections/${sectionId}`);
        return response.data.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data.message || 'Error al eliminar sección';
        }
        throw 'No se pudo conectar con el servidor';
    }
};

//Obtener estudiantes del docente
export const getTeacherStudents = async (teacherId) => {
    try {
        const response = await apiClient.get(`/teachers/${teacherId}/students`);
        return response.data.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data.message || 'Error al obtener estudiantes';
        }
        throw 'No se pudo conectar con el servidor';
    }
};
