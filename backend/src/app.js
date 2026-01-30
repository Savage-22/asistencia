import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import studentRoutes from './routes/student.routes.js';
import authRoutes from './routes/auth.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';

const app = express();

app.use(express.json());

//Configuración cors
app.use(cors({
    origin: 'http://localhost:5173', // Reemplaza con el origen de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
}));


//Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/students', studentRoutes);
app.use('/enrollment', enrollmentRoutes);
app.use('/teachers', teacherRoutes);
app.use('/attendance', attendanceRoutes);

export default app;