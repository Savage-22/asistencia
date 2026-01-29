import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * USER ROUTES
 * Define los endpoints de la API de usuarios
 * 
 * EJEMPLO DE CÓMO PROTEGER RUTAS CON JWT:
 * - authenticateToken: Verifica que el usuario tenga un token válido
 * - authorizeRole('ADMIN'): Además verifica que tenga el rol ADMIN
 */

// GET /users - Obtener todos los usuarios (PROTEGIDA - Solo usuarios autenticados)
router.get('/', authenticateToken, userController.getAllUsers);

// GET /users/:id - Obtener usuario por ID
//router.get('/:id', userController.getUserById);

// POST /users - Crear nuevo usuario (PROTEGIDA - Solo ADMIN puede crear usuarios)
router.post('/', authenticateToken, authorizeRole('ADMIN'), userController.createUser);

// PUT /users/:id - Actualizar usuario
//router.put('/:id', userController.updateUser);

// DELETE /users/:id - Eliminar usuario
//router.delete('/:id', userController.deleteUser);

export default router;
