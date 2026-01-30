import pool from '../db.js';

/**
 * Registra la asistencia de un estudiante
 * @param {string} qrToken - Token del código QR escaneado
 * @param {string} teacherId - ID del docente que registra
 * @returns {Promise<Object>} - Datos del estudiante y registro de asistencia
 */
export async function recordAttendance(qrToken, teacherId) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // 1. Buscar estudiante por QR token
        const studentQuery = `
            SELECT s.id_student, s.first_name, s.last_name, s.is_active, 
                    sec.grade, sec.section_name
            FROM students s
            LEFT JOIN sections sec ON s.id_section = sec.id_section
            WHERE s.qr_token = $1
        `;
        const studentResult = await client.query(studentQuery, [qrToken]);

        if (studentResult.rows.length === 0) {
            throw new Error('QR_NO_ENCONTRADO');
        }

        const student = studentResult.rows[0];

        if (!student.is_active) {
            throw new Error('ESTUDIANTE_INACTIVO');
        }

        // 2. Verificar si ya registró asistencia hoy
        const today = new Date().toISOString().split('T')[0];
        const existingAttendanceQuery = `
            SELECT id_atten, status 
            FROM attendance 
            WHERE id_student = $1 AND date_record = $2
        `;
        const existingResult = await client.query(existingAttendanceQuery, [
            student.id_student,
            today
        ]);

        if (existingResult.rows.length > 0) {
            throw new Error('YA_REGISTRADO');
        }

        // 3. Registrar nueva asistencia (el ID se genera automáticamente con BIGSERIAL)
        const insertQuery = `
            INSERT INTO attendance (
                id_student, recorded_by, status, date_record
            ) VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const insertResult = await client.query(insertQuery, [
            student.id_student,
            teacherId,
            'PRESENTE',
            today
        ]);

        await client.query('COMMIT');

        return {
            success: true,
            attendance: insertResult.rows[0],
            student: {
                id: student.id_student,
                firstName: student.first_name,
                lastName: student.last_name,
                grade: student.grade,
                section: student.section_name
            }
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Obtener asistencias del día actual
 * @param {string} teacherId - ID del docente (opcional)
 * @returns {Promise<Array>} - Lista de asistencias
 */
export async function getTodayAttendance(teacherId = null) {
    const today = new Date().toISOString().split('T')[0];
    
    let query = `
        SELECT 
            a.id_atten,
            a.check_in_timestamp,
            a.status,
            s.id_student,
            s.first_name,
            s.last_name,
            sec.grade,
            sec.section_name,
            u.first_name as teacher_first_name,
            u.last_name as teacher_last_name
        FROM attendance a
        INNER JOIN students s ON a.id_student = s.id_student
        LEFT JOIN sections sec ON s.id_section = sec.id_section
        INNER JOIN users u ON a.recorded_by = u.id_user
        WHERE a.date_record = $1
    `;
    
    const params = [today];
    
    if (teacherId) {
        query += ' AND a.recorded_by = $2';
        params.push(teacherId);
    }
    
    query += ' ORDER BY a.check_in_timestamp DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
}
