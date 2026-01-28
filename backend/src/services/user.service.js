import * as userModel from '../models/user.model.js';

export const createUser = async (userData) => {
    const { name, lastname, email, password, role } = userData;

    // Validation: Required fields
    if (!name || !lastname || !email || !password) {
        throw new Error('Missing required fields: name, lastname, email, password');
    }

    // Validation: Valid email
    if (!email.includes('@')) {
        throw new Error('Invalid email format');
    }

    // Validation: Unique email
    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
        throw new Error('Email is already registered');
    }

    // Password must be at least 6 characters long, contain a number and an uppercase letter
    if(!password || password.length < 6 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
        throw new Error('Password must be at least 6 characters long, contain a number and an uppercase letter');
    }

    // Create user
    return await userModel.createUser({ name, lastname, email, password, role });
};

export const getAllUsers = async () => {
    return await userModel.getAllUsers();
};

export const getUserById = async (id) => {
    const user = await userModel.getUserById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

export const getUserByEmail = async (email) => {
    return await userModel.getUserByEmail(email);
};