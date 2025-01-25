const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors());
app.use(express.json());

// Configuración de PostgreSQL
const pool = new Pool({
    user: 'admin',
    host: 'postgres',
    database: 'voting_system',
    password: 'admin',
    port: 5432,
});

// Rutas
app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.post('/vote', async (req, res) => {
    const { userId, option } = req.body;

    try {
        await pool.query('INSERT INTO votes (user_id, option) VALUES ($1, $2)', [userId, option]);
        const results = await pool.query('SELECT option, COUNT(*) as votes FROM votes GROUP BY option');
        io.emit('updateResults', results.rows);
        res.status(201).send('Voto registrado');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar el voto');
    }
});

app.get('/results', async (req, res) => {
    try {
        const results = await pool.query('SELECT option, COUNT(*) as votes FROM votes GROUP BY option');
        res.json(results.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los resultados');
    }
});

// Configuración de WebSockets
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Servidor
server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
