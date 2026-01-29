import pool from '../db.js';
import { generateId } from '../utils/idGenerator.js';

export const createUser = async (userData) => {
    const { name, lastname, email, password, role } = userData;
    const id_user = await generateId('USER');
    
    const result = await pool.query(
        `INSERT INTO users (id_user, first_name, last_name, email, password, role) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id_user, first_name, last_name, email, role, is_active, created_at`,
        [id_user, name, lastname, email, password, role || 'TEACHER']
    );
    return result.rows[0];
};

export const getAllUsers = async () => {
    const result = await pool.query(
        `SELECT id_user, first_name, last_name, email, role, is_active, created_at 
        FROM users ORDER BY created_at DESC`
    );
    return result.rows;
};

export const getUserByEmail = async (email) => {
    const result = await pool.query(
        'SELECT id_user, first_name, last_name, email, role, is_active FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
};

export const getUserByEmailWithPassword = async (email) => {
    const result = await pool.query(
        'SELECT id_user, first_name, last_name, email, password, role, is_active FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
};