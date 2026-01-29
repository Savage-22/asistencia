import * as authService from '../services/auth.service.js';


//Controlador de login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await authService.loginUser(email, password);
        
        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: result
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message || 'Error de autenticación'
        });
    }
};
