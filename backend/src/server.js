import app from './app.js';
import pool from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

// Verificar conexión a BD
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error conectando a PostgreSQL:', err.message);
    } else {
        console.log('✅ Conectado a PostgreSQL');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});