import * as teacherModel from '../models/teacher.model.js';
import * as userModel from '../models/user.model.js';
import { hashPassword } from '../utils/passwordHasher.js';

//Crear un docente (usuario con rol TEACHER)
export const createTeacher = async (teacherData) => {
    const { first_name, last_name, email, password } = teacherData;
    
    // Validaciones
    if (!first_name || !last_name || !email || !password) {
        throw new Error('Todos los campos son requeridos');
    }
    
    // Validar email
    if (!email.includes('@')) {
        throw new Error('Email inválido');
    }
    
    // Verificar email único
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
        throw new Error('El email ya está registrado');
    }
    
    // Validar contraseña
    if (password.length < 6 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
        throw new Error('La contraseña debe tener al menos 6 caracteres, un número y una mayúscula');
    }
    
    // Hashear contraseña
    const hashedPassword = await hashPassword(password);
    
    // Crear usuario con rol TEACHER
    return await userModel.createUser({
        name: first_name,
        lastname: last_name,
        email,
        password: hashedPassword,
        role: 'TEACHER'
    });
};

//Asignar secciones a un docente
export const assignSections = async (id_user, sectionIds) => {
    if (!Array.isArray(sectionIds) || sectionIds.length === 0) {
        throw new Error('Debe proporcionar al menos una sección');
    }
    
    // Verificar que el usuario sea docente
    const teacher = await teacherModel.getTeacherById(id_user);
    if (!teacher) {
        throw new Error('Docente no encontrado');
    }
    
    await teacherModel.assignSectionsToTeacher(id_user, sectionIds);
    
    return {
        id_user,
        sections_assigned: sectionIds.length,
        message: 'Secciones asignadas exitosamente'
    };
};

//Obtener todos los docentes
export const getAllTeachers = async () => {
    return await teacherModel.getAllTeachers();
};

//Obtener docente por ID
export const getTeacherById = async (id_user) => {
    const teacher = await teacherModel.getTeacherById(id_user);
    if (!teacher) {
        throw new Error('Docente no encontrado');
    }
    return teacher;
};

//Eliminar asignación de sección
export const removeSection = async (id_user, id_section) => {
    await teacherModel.removeSectionFromTeacher(id_user, id_section);
    return { message: 'Sección eliminada exitosamente' };
};

//Obtener estudiantes del docente
export const getTeacherStudents = async (id_user) => {
    return await teacherModel.getStudentsByTeacher(id_user);
};
