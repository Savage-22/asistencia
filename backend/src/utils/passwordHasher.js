import bcrypt from 'bcrypt';

/**
 * BCRYPT - Para hashear contraseñas de usuarios
 * 
 * ¿Cómo funciona?
 * 1. Toma la contraseña en texto plano (ej: "Pass123")
 * 2. Genera un "salt" aleatorio (sal única para cada hash)
 * 3. Aplica múltiples rondas de encriptación
 * 4. Resultado: Un hash único e irreversible
 * 
 * Ejemplo:
 * - Input: "Pass123"
 * - Output: "$2b$10$N9qo8uLOickgx2ZMRZoMye.IwKgk7hG8XGk5SxPEWG0gKlWkJG3zK"
 */

const SALT_ROUNDS = 10; // Mayor número = más seguro pero más lento (10 es el estándar)

/**
 * Hashea una contraseña en texto plano
 * @param {string} plainPassword - Contraseña sin encriptar
 * @returns {Promise<string>} - Hash de la contraseña
 */
export const hashPassword = async (plainPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        return hashedPassword;
    } catch (error) {
        console.error('Error al hashear contraseña:', error);
        throw new Error('No se pudo procesar la contraseña');
    }
};

/**
 * Comparar una contraseña en texto plano con un hash
 * 
 * @param {string} plainPassword - Contraseña que ingresó el usuario
 * @param {string} hashedPassword - Hash almacenado en la BD
 * @returns {Promise<boolean>} - true si coinciden, false si no
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error al comparar contraseñas:', error);
        throw new Error('Error de autenticación');
    }
};
