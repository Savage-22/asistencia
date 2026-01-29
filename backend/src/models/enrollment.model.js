import pool from '../db.js';
import { generateId } from '../utils/idGenerator.js';
import { generateQRToken } from '../utils/qrGenerator.js';

/**
 * MATRÍCULA CONJUNTA - Alumno + Apoderado
 * Se usa una TRANSACCIÓN SQL para garantizar que se cree todo o nada
 * 
 * @param {Object} enrollmentData - Datos de matrícula
 * @param {Object} enrollmentData.student - Datos del estudiante
 * @param {Object} enrollmentData.parent - Datos del apoderado
 * @returns {Promise<Object>} Datos completos de la matrícula
 */
export const enrollStudentWithParent = async (enrollmentData) => {
    const client = await pool.connect();
    
    try {
        // INICIAR TRANSACCIÓN
        await client.query('BEGIN');
        
        // 1. Generar IDs
        const id_student = await generateId('STUDENT');
        const id_parent = await generateId('PARENT');
        const qr_token = await generateQRToken(id_student);
        
        // 2. Verificar si el padre ya existe por email o teléfono
        let parentId = id_parent;
        const existingParent = await client.query(
            'SELECT id_parent FROM parents WHERE email = $1 OR phone_number = $2',
            [enrollmentData.parent.email, enrollmentData.parent.phone]
        );
        
        if (existingParent.rows.length > 0) {
            // Si el padre ya existe, usar su ID
            parentId = existingParent.rows[0].id_parent;
        } else {
            // 3. Crear nuevo padre
            await client.query(
                `INSERT INTO parents (id_parent, first_name, last_name, phone_number, email)
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    id_parent,
                    enrollmentData.parent.first_name,
                    enrollmentData.parent.last_name,
                    enrollmentData.parent.phone,
                    enrollmentData.parent.email
                ]
            );
        }
        
        // 4. Crear estudiante
        const studentResult = await client.query(
            `INSERT INTO students (id_student, first_name, last_name, qr_token, id_section)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_student, first_name, last_name, qr_token, id_section, created_at`,
            [
                id_student,
                enrollmentData.student.first_name,
                enrollmentData.student.last_name,
                qr_token,
                enrollmentData.student.id_section
            ]
        );
        
        // 5. Crear relación estudiante-padre
        await client.query(
            `INSERT INTO student_parents (id_student, id_parent, relationship_type)
            VALUES ($1, $2, $3)`,
            [id_student, parentId, enrollmentData.parent.relationship_type || 'APODERADO']
        );
        
        // CONFIRMAR TRANSACCIÓN
        await client.query('COMMIT');
        
        return {
            student: studentResult.rows[0],
            parent_id: parentId,
            message: 'Matrícula exitosa'
        };
        
    } catch (error) {
        // Si algo falla, CANCELAR TODO
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Obtener secciones disponibles
 */
export const getAllSections = async () => {
    const result = await pool.query(
        'SELECT id_section, grade, level, section_name FROM sections ORDER BY grade, section_name'
    );
    return result.rows;
};
