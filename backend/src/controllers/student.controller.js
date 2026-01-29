import * as studentService from '../services/student.service.js';


 //Crea un nuevo estudiante
export const createStudent = async (req, res) => {
    try {
        const studentData = req.body;
        const newStudent = await studentService.createStudent(studentData);
        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: newStudent
        });
    } catch (error) {
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
};


//Obtiene todos los estudiantes
export const getAllStudents = async (req, res) => {
    try {
        const students = await studentService.getAllStudents();
        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};


//Obtiene un estudiante por ID
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await studentService.getStudentById(id);
        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        res.status(404).json({ 
            success: false,
            error: error.message 
        });
    }
};


//Genera la imagen QR de un estudiante
export const getStudentQRImage = async (req, res) => {
    try {
        const { id } = req.params;
        const qrData = await studentService.generateStudentQRImage(id);
        res.status(200).json({
            success: true,
            data: qrData
        });
    } catch (error) {
        res.status(404).json({ 
            success: false,
            error: error.message 
        });
    }
};
