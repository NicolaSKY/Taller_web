// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configurar conexión con PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'kanistick',
    password: 'password',
    port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/contacto', async (req, res) => {
    const { nombre, correo, asunto, mensaje } = req.body;

    try {
        const query = 'INSERT INTO contactos(nombre, correo, asunto, mensaje) VALUES($1, $2, $3, $4)';
        const values = [nombre, correo, asunto, mensaje];

        await pool.query(query, values);

        res.json({ mensaje: 'Tu mensaje fue recibido. ¡Gracias por contactarnos!' });
    } catch (err) {
        console.error('Error al insertar en la base de datos', err);
        res.status(500).json({ error: 'Hubo un error al procesar tu solicitud' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
