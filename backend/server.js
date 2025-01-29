const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const DAOFactory = require('./dao/dao-factory');
const VoteService = require('./services/vote-service');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const dbType = process.env.DB_TYPE || 'postgres'; // Cambiar a 'mongo' según sea necesario
const dao = DAOFactory.createDAO(dbType);
const voteService = new VoteService(dao);

// Inicializar conexión a la base de datos
dao.connect().catch((err) => {
    console.error('Error al inicializar la base de datos:', err.message);
    process.exit(1);
});

// Rutas
app.post('/vote', async (req, res) => {
    const { userId, option } = req.body;
    try {
        await voteService.registerVote(userId, option);
        const results = await voteService.getResults();
        io.emit('updateResults', results);
        res.status(201).send('Voto registrado');
    } catch (err) {
        res.status(500).send('Error al registrar el voto');
    }
});

app.get('/results', async (req, res) => {
    try {
        const results = await voteService.getResults();
        res.json(results);
    } catch (err) {
        res.status(500).send('Error al obtener resultados');
    }
});

// Servidor
server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
