import pool from '../db.js';

/**
 * Genera un ID personalizado de 10 caracteres
 * Formato: YYYY + TIPO + SECUENCIA (4 dígitos)
 * 
 * Ejemplos:
 * - Usuario 2025: 2025200001
 * - Estudiante 2025: 2025100001
 * - Padre 2025: 2025300001
 * 
 * @param {string} type - 'USER', 'STUDENT', 'PARENT'
 * @returns {string} ID generado de 10 caracteres
 */
export const generateId = async (type) => {
    const year = new Date().getFullYear();
    
    // Definir código según el tipo
    const typeCodes = {
        'STUDENT': '10',
        'USER': '20',
        'PARENT': '30'
    };
    
    // Obtener el código del tipo proporcionado
    const typeCode = typeCodes[type];
    if (!typeCode) {
        throw new Error(`Tipo no válido: ${type}. Usa 'USER', 'STUDENT' o 'PARENT'`);
    }
    
    // Prefijo: año + tipo (ej: "202520")
    const prefix = `${year}${typeCode}`;
    
    // Obtener el último ID con este prefijo
    const tables = {
        'STUDENT': { table: 'students', column: 'id_student' },
        'USER': { table: 'users', column: 'id_user' },
        'PARENT': { table: 'parents', column: 'id_parent' }
    };
    
    const { table, column } = tables[type];
    
    const query = `
        SELECT ${column} 
        FROM ${table} 
        WHERE ${column} LIKE $1 
        ORDER BY ${column} DESC 
        LIMIT 1
    `;
    
    const result = await pool.query(query, [`${prefix}%`]);
    
    let nextNumber = 1; // Empezar en 0001
    
    if (result.rows.length > 0) {
        // Si existe un ID previo, extraer los últimos 4 dígitos y sumar 1
        const lastId = result.rows[0][column];
        const lastSequence = lastId.slice(-4); // Últimos 4 dígitos
        nextNumber = parseInt(lastSequence, 10) + 1;
    }
    
    // Formatear a 4 dígitos con ceros a la izquierda (0001, 0002, etc.)
    const sequence = nextNumber.toString().padStart(4, '0');
    
    return `${prefix}${sequence}`;
};
