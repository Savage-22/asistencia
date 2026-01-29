import { verifyToken } from '../utils/jwtHandler.js';

/*MIDDLEWARE DE AUTENTICACIÓN
* verifica el token JWT en las solicitudes protegidas

* Uso:
* router.get('/protected', authenticateToken, protectedController);
*/

export const authenticateToken = (req, res, next) => {
    try {
        // 1. Extraer el token del header "Authorization"
        const authHeader = req.headers['authorization'];
        
        // El formato debe ser: "Bearer TOKEN_AQUI"
        // Ejemplo: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        const token = authHeader && authHeader.split(' ')[1]; // Toma solo la parte después de "Bearer "
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado. Token no proporcionado'
            });
        }

        // 2. Verificar que el token sea válido
        const decoded = verifyToken(token);
        
        // 3. Guardar los datos del usuario en req.user para usarlos en el controlador
        req.user = decoded;
        
        // 4. Continuar al siguiente middleware o controlador
        next();
        
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: error.message || 'Token inválido o expirado'
        });
    }
};

/**
 * Verifica que el usuario tenga un rol específico
 * 
 * Uso:
 * router.delete('/users/:id', authenticateToken, authorizeRole('ADMIN'), deleteUser);
 */
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user ya fue establecido por authenticateToken
        if (!req.user || !req.user.role) {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado. Se requiere rol: ${allowedRoles.join(' o ')}`
            });
        }

        next();
    };
};
