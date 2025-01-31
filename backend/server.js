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
const daoPostgres = DAOFactory.createDAO('postgres');
const daoMongo = DAOFactory.createDAO('mongo');

console.log("daoPostgres:", daoPostgres);  // 👈 Agrega esto para depurar

const voteService = new VoteService(daoPostgres, daoMongo);

// Inicializar conexión a las bases de datos
Promise.all([daoPostgres.connect(), daoMongo.connect()])
    .then(() => console.log('Bases de datos inicializadas correctamente.'))
    .catch((err) => {
        console.error('Error al inicializar las bases de datos:', err.message);
        process.exit(1);
    });

// WebSockets
io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

// Rutas
app.post('/vote', async (req, res) => {
    const { userId, candidateId } = req.body;
    try {
        await voteService.registerVote(userId, candidateId);
        const results = await voteService.getResults();
        
        // Emitir evento de actualización a todos los clientes conectados
        io.emit('updateResults', results);

        res.status(201).json({ message: 'Voto registrado exitosamente' });
    } catch (err) {
        console.error('Error al registrar el voto:', err.message);
        res.status(500).json({ error: 'Error al registrar el voto' });
    }
});

app.get('/results', async (req, res) => {
    try {
        const results = await voteService.getResults();
        res.json(results);
    } catch (err) {
        console.error('Error al obtener resultados:', err.message);
        res.status(500).json({ error: 'Error al obtener resultados' });
    }
});


// ✅ ** Ruta para verificar que el backend está funcionando**
app.get('/', (req, res) => {
    res.send('Servidor backend funcionando correctamente 🚀');
});


// Iniciar servidor
server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
