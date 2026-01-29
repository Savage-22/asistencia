import pool from '../db.js';
import { generateId } from '../utils/idGenerator.js';

//Crea un nuevo estudiante en la base de datos
export const createStudent = async (studentData) => {
    const { name, lastname, qr_token, id_section } = studentData;
    const id_student = await generateId('STUDENT');
    
    const result = await pool.query(
        `INSERT INTO students (id_student, first_name, last_name, qr_token, id_section) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id_student, first_name, last_name, qr_token, id_section, is_active, created_at`,
        [id_student, name, lastname, qr_token, id_section || null]
    );
    return result.rows[0];
};


//Obtiene todos los estudiantes
export const getAllStudents = async () => {
    const result = await pool.query(
        `SELECT 
            s.id_student, 
            s.first_name, 
            s.last_name, 
            s.qr_token,
            s.id_section,
            sec.grade,
            sec.section_name,
            s.is_active, 
            s.created_at 
        FROM students s
        LEFT JOIN sections sec ON s.id_section = sec.id_section
        ORDER BY s.created_at DESC`
    );
    return result.rows;
};


//Obtiene un estudiante por ID
export const getStudentById = async (id) => {
    const result = await pool.query(
        `SELECT 
            s.id_student, 
            s.first_name, 
            s.last_name, 
            s.qr_token,
            s.id_section,
            sec.grade,
            sec.section_name,
            s.is_active, 
            s.created_at 
        FROM students s
        LEFT JOIN sections sec ON s.id_section = sec.id_section
        WHERE s.id_student = $1`,
        [id]
    );
    return result.rows[0];
};


//Obtiene un estudiante por su QR token
export const getStudentByQRToken = async (qr_token) => {
    const result = await pool.query(
        'SELECT id_student, first_name, last_name, id_section, is_active FROM students WHERE qr_token = $1',
        [qr_token]
    );
    return result.rows[0];
};
