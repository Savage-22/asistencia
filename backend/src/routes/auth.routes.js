import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

/**
 * AUTH ROUTES
 * Define los endpoints de autenticación
 */

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login);

export default router;
