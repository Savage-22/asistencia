import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(express.json());

//Configuración cors
app.use(cors({
    origin: 'http://localhost:5173', // Reemplaza con el origen de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
}));


//Routes
app.use('/users', userRoutes);
//app.use('/auth', authRoutes);

export default app;