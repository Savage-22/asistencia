import apiClient from './api.js';

/**
 * Servicio de login
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{token: string, user: object}>}
 */
export const loginService = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login', {
            email,
            password
        });
        
        if (response.data.success) {
            return response.data.data; // { token, user }
        } else {
            throw response.data.message || 'Error en el login';
        }
    } catch (error) {
        if (error.response) {
            // El servidor respondió con un error
            throw error.response.data.message || 'Credenciales inválidas';
        } else if (error.request) {
            // La petición fue hecha pero no hubo respuesta
            throw 'No se pudo conectar con el servidor';
        } else {
            // Algo pasó al configurar la petición
            throw error.message || 'Error inesperado';
        }
    }
};

/**
 * Guardar datos de autenticación en localStorage
 * @param {string} token 
 * @param {object} user 
 */
export const saveAuthData = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

// Obtener token guardado
export const getToken = () => {
    return localStorage.getItem('token');
};

// Obtener usuario guardado
export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Cerrar sesión (limpiar localStorage)
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
    return !!getToken();
};
