import axios from 'axios';
import { getToken } from './auth.service.js';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * INTERCEPTOR - Se ejecuta ANTES de cada petición
 * 
 * Sirve para que automáticamente adjunte el token JWT a TODAS las peticiones
 * 
 * Antes (manual):
 * axios.get('/users', { headers: { Authorization: `Bearer ${token}` } })
 * 
 * Ahora (automático):
 * axios.get('/users') // El interceptor lo hace por ti
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            // Agregar el token al header Authorization
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;