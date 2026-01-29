import * as userModel from '../models/user.model.js';
import { comparePassword } from '../utils/passwordHasher.js';
import { generateToken } from '../utils/jwtHandler.js';

/**
 * Servicio de autenticación - Login
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<{token: string, user: object}>}
 */
export const loginUser = async (email, password) => {
    // 1. Validar que vengan los datos
    if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
    }

    // 2. Buscar usuario por email (debe traer la contraseña hasheada)
    const user = await userModel.getUserByEmailWithPassword(email);
    
    if (!user) {
        throw new Error('Credenciales inválidas');
    }

    // 3. Verificar que el usuario esté activo
    if (!user.is_active) {
        throw new Error('Usuario inactivo. Contacte al administrador');
    }

    // 4. Comparar contraseña
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
        throw new Error('Credenciales inválidas');
    }

    // 5. Generar token JWT (ahora usando la función limpia de utils)
    const token = generateToken({
        id_user: user.id_user,
        email: user.email,
        role: user.role
    });

    // 6. Retornar token y datos del usuario (sin la contraseña)
    return {
        token,
        user: {
            id_user: user.id_user,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }
    };
};
