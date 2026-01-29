import pool from '../db.js';

/**
 * Asignar secciones a un docente
 * @param {string} id_user - ID del docente
 * @param {Array<string>} sectionIds - Array de IDs de secciones
 */
export const assignSectionsToTeacher = async (id_user, sectionIds) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Insertar nuevas asignaciones
        for (const id_section of sectionIds) {
            await client.query(
                `INSERT INTO teacher_sections (id_user, id_section)
                VALUES ($1, $2)
                ON CONFLICT (id_user, id_section) DO NOTHING`,
                [id_user, id_section]
            );
        }
        
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

//Obtener todas las secciones de un docente
export const getTeacherSections = async (id_user) => {
    const result = await pool.query(
        `SELECT 
            ts.id_section,
            s.grade,
            s.level,
            s.section_name,
            ts.assigned_at
        FROM teacher_sections ts
        JOIN sections s ON ts.id_section = s.id_section
        WHERE ts.id_user = $1
        ORDER BY s.grade, s.section_name`,
        [id_user]
    );
    return result.rows;
};

//Obtener todos los docentes
export const getAllTeachers = async () => {
    const result = await pool.query(
        `SELECT 
            u.id_user,
            u.first_name,
            u.last_name,
            u.email,
            u.is_active,
            u.created_at,
            COUNT(ts.id_section) as sections_count
        FROM users u
        LEFT JOIN teacher_sections ts ON u.id_user = ts.id_user
        WHERE u.role = 'TEACHER'
        GROUP BY u.id_user
        ORDER BY u.created_at DESC`
    );
    return result.rows;
};

//Obtener docente por ID con sus secciones
export const getTeacherById = async (id_user) => {
    const teacherResult = await pool.query(
        `SELECT id_user, first_name, last_name, email, is_active, created_at
        FROM users
        WHERE id_user = $1 AND role = 'TEACHER'`,
        [id_user]
    );
    
    if (teacherResult.rows.length === 0) {
        return null;
    }
    
    const sections = await getTeacherSections(id_user);
    
    return {
        ...teacherResult.rows[0],
        sections
    };
};

//Eliminar asignación de sección a docente
export const removeSectionFromTeacher = async (id_user, id_section) => {
    await pool.query(
        'DELETE FROM teacher_sections WHERE id_user = $1 AND id_section = $2',
        [id_user, id_section]
    );
};

//Obtener estudiantes de las secciones de un docente
export const getStudentsByTeacher = async (id_user) => {
    const result = await pool.query(
        `SELECT DISTINCT
            s.id_student,
            s.first_name,
            s.last_name,
            s.qr_token,
            s.id_section,
            sec.grade,
            sec.section_name,
            s.is_active
        FROM students s
        JOIN sections sec ON s.id_section = sec.id_section
        JOIN teacher_sections ts ON sec.id_section = ts.id_section
        WHERE ts.id_user = $1 AND s.is_active = true
        ORDER BY sec.grade, sec.section_name, s.last_name, s.first_name`,
        [id_user]
    );
    return result.rows;
};
