import jwt from 'jsonwebtoken';

/**
 * JWT HANDLER - Manejo de JSON Web Tokens
 *
 * - Generar tokens firmados para autenticar usuarios
 * - Verificar que los tokens sean válidos y no hayan sido manipulados
 * 
 * Conceptos clave:
 * - SECRET: Clave secreta que solo conoce el servidor (como una llave maestra)
 * - PAYLOAD: Los datos que guardaremos en el token (id, email, role)
 * - EXPIRATION: Tiempo de vida del token (24h = expira en 24 horas)
 */

// La clave secreta DEBE estar en .env en producción
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const JWT_EXPIRES_IN = '24h';

/**
 * Genera un token JWT firmado
 * 
 * @param {Object} payload - Datos a incluir en el token
 * @param {string} payload.id_user - ID del usuario
 * @param {string} payload.email - Email del usuario
 * @param {string} payload.role - Rol del usuario (ADMIN, TEACHER)
 * @returns {string} Token JWT firmado
 * 
 * Ejemplo:
 * const token = generateToken({ 
 *   id_user: '2026200001', 
 *   email: 'admin@test.com', 
 *   role: 'ADMIN' 
 * });
 * // Retorna: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoi..."
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verifica y decodifica un token JWT
 * 
 * @param {string} token - Token JWT a verificar
 * @returns {Object} Datos decodificados del token (payload)
 * @throws {Error} Si el token es inválido, expirado o manipulado
 * 
 * Ejemplo:
 * try {
 *   const data = verifyToken(token);
 *   console.log(data); // { id_user: '2026200001', email: 'admin@test.com', ... }
 * } catch (error) {
 *   console.log('Token inválido');
 * }
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expirado. Por favor, inicia sesión nuevamente');
        }
        if (error.name === 'JsonWebTokenError') {
            throw new Error('Token inválido');
        }
        throw new Error('Error al verificar token');
    }
};
