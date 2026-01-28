import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();

/**
 * USER ROUTES
 * Define los endpoints de la API de usuarios
 */

// GET /api/users - Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Obtener usuario por ID
//router.get('/:id', userController.getUserById);

// POST /api/users - Crear nuevo usuario
router.post('/', userController.createUser);

// PUT /api/users/:id - Actualizar usuario
//router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Eliminar usuario
//router.delete('/:id', userController.deleteUser);

export default router;
