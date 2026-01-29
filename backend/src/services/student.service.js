import * as studentModel from '../models/student.model.js';
import { generateQRToken, generateQRCodeImage } from '../utils/qrGenerator.js';


//Crea un nuevo estudiante
export const createStudent = async (studentData) => {
    const { name, lastname, id_section } = studentData;

    // Validación: Campos requeridos
    if (!name || !lastname) {
        throw new Error('Missing required fields: name, lastname');
    }

    // Generar el estudiante primero para obtener su ID
    // El ID se genera en el modelo, pero necesitamos el token antes
    // Solución: generamos un token temporal y lo reemplazamos después
    
    // Por ahora, pasamos null y lo generaremos en el modelo
    const newStudent = await studentModel.createStudent({
        name,
        lastname,
        qr_token: null, // Lo generaremos después con el ID
        id_section
    });

    // Ahora que tenemos el ID, generamos el token QR
    const qr_token = await generateQRToken(newStudent.id_student);
    
    // Actualizamos el estudiante con el token
    await updateStudentQRToken(newStudent.id_student, qr_token);
    
    return {
        ...newStudent,
        qr_token
    };
};

/**
 * Actualiza el QR token de un estudiante (función auxiliar)
 */
const updateStudentQRToken = async (id_student, qr_token) => {
    const pool = (await import('../db.js')).default;
    await pool.query(
        'UPDATE students SET qr_token = $1 WHERE id_student = $2',
        [qr_token, id_student]
    );
};

/**
 * Obtiene todos los estudiantes
 */
export const getAllStudents = async () => {
    return await studentModel.getAllStudents();
};

/**
 * Obtiene un estudiante por ID
 */
export const getStudentById = async (id) => {
    const student = await studentModel.getStudentById(id);
    if (!student) {
        throw new Error('Student not found');
    }
    return student;
};

/**
 * Genera la imagen QR de un estudiante
 * Esta función NO guarda la imagen, solo la genera bajo demanda
 */
export const generateStudentQRImage = async (id) => {
    const student = await studentModel.getStudentById(id);
    if (!student) {
        throw new Error('Student not found');
    }

    if (!student.qr_token) {
        throw new Error('Student does not have a QR token');
    }

    // Genera la imagen QR en base64
    const qrImage = await generateQRCodeImage(student.qr_token);
    
    return {
        id_student: student.id_student,
        name: `${student.first_name} ${student.last_name}`,
        qr_token: student.qr_token,
        qr_image: qrImage // Data URI en base64
    };
};
