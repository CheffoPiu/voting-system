const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const DAOFactory = require('./dao/dao-factory');
const VoteService = require('./services/vote-service');
const UserDTO = require('./dto/user-dto'); // ✅ Importa el DTO
const CandidatoDTO = require('./dto/candidato-dto'); // ✅ Importar DTO
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const kafka = require('kafka-node');
const { sendEmail, sendSMS } = require('./services/notificationService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
// Importa Lodash al inicio del archivo
const _ = require('lodash');

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


//JWT verifyToken
// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    jwt.verify(token, 'secreto_super_seguro', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido o expirado' });
        }
        req.user = user;  // Añadir info decodificada del token al req
        next();
    });
};


// Kafka Consumer para recibir actualizaciones en tiempo real
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER || "localhost:9092" });
const consumer = new kafka.Consumer(client, [{ topic: "vote-events", partition: 0 }], { autoCommit: true });

consumer.on("message", async (message) => {
    console.log("📩 Kafka Consumer recibió un evento:", message.value);
    const vote = JSON.parse(message.value);
    console.log("vote",vote)
    // Notificar al usuario por Email y SMS
    const emailMessage = `Tu voto ha sido registrado con éxito.\n\nDetalles:\n🆔 Usuario: ${vote.userId}\n🗳️ Candidato: ${vote.candidateId}\n📅 Fecha: ${vote.timestamp}`;
    const smsMessage = `🗳️ Tu voto fue registrado: Usuario ${vote.userId}, Candidato ${vote.candidateId}`;

    // Datos ficticios de usuarios (Reemplazar con consulta a DB)
    const userEmail = "yedpump@gmail.com";
    const userPhone = "+593987164499";

    //await sendEmail(userEmail, "Confirmación de Voto", emailMessage);
    //await sendSMS(userPhone, smsMessage);
});

consumer.on("error", (err) => {
    console.error("❌ Error en Kafka Consumer:", err);
});



app.post('/auth/login', async (req, res) => {
    try {
        const { cedula, password } = req.body;
        console.log("📩 Recibiendo credenciales:", { cedula, password });

        if (!cedula || !password) {
            return res.status(400).json({ error: 'Cédula y contraseña son obligatorios' });
        }

        const user = await daoPostgres.getUserByCedula(cedula);
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        console.log("user",user)

        // Verificar contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        console.log("passwordMatch",passwordMatch)

        // Generar token JWT
        const token = jwt.sign(
            { userId: user.id, cedula: user.cedula, rol: user.rol },
            'secreto_super_seguro',
            { expiresIn: '2h' }
        );

        res.json({ message: 'Login exitoso', token, user });
    } catch (err) {
        console.error('❌ Error en login:', err.message);
        res.status(500).json({ error: 'Error en el login' });
    }
});


// Esta función obtiene resultados y los emite vía WebSockets
const emitResults = async () => {
    try {
        const results = await voteService.getResults();
        io.emit('updateResults', results);
        console.log("📡 Resultados enviados por WebSockets");
    } catch (err) {
        console.error("❌ Error al emitir resultados:", err.message);
    }
};

// Configura throttle para controlar la frecuencia de envío (por ejemplo, 5 segundos)
const throttledEmitResults = _.throttle(emitResults, 10000, { trailing: true });


// Rutas
app.post('/vote', async (req, res) => {
    try {
        console.log("📩 Recibiendo voto:", req.body);
        const { userId, candidateId } = req.body;

        if (!userId || !candidateId) {
            return res.status(400).json({ error: 'Faltan datos: userId y candidateId son obligatorios' });
        }

        // ✅ Ahora usa `voteService.registerVote` para guardar en ambos
        await voteService.registerVote(userId, candidateId, req);

        // Obtener resultados actualizados
        //const results = await voteService.getResults();

        // Emitir actualización a todos los clientes conectados
        //io.emit('updateResults', results);

        // Llama a la función throttled (no se ejecutará más de una vez cada 5 segundos)
        throttledEmitResults();

        res.status(201).json({ message: '✅ Voto registrado exitosamente en PostgreSQL y MongoDB' });
    } catch (err) {
        console.error('❌ ServerError al registrar el voto:', err.message);
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



/**
 * Rutas para Usuarios
 */


// ✅ RUTA: Crear usuario
app.post('/admin/users', async (req, res) => {
    try {
        console.log("re.body",req.body)
        const { cedula, nombre, apellido, email, password, rol } = req.body;

        // Validaciones (sin ID)
        if (!cedula || !nombre || !apellido || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // Guardar usuario en PostgreSQL SIN enviar ID
        const newUser = await daoPostgres.createUser({ cedula, nombre, apellido, email, password, rol });

        res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
    } catch (err) {
        console.error('❌ Error al registrar usuario:', err.message);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// ✅ RUTA: Obtener todos los usuarios
app.get('/admin/users', async (req, res) => {
    try {
        const users = await daoPostgres.getUsers();
        const usersDTO = users.map(user => new UserDTO(user)); // Convierte usuarios a DTOs
        res.json(usersDTO);
    } catch (err) {
        console.error('❌ Error al obtener usuarios:', err.message);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// ✅ RUTA: Obtener usuario por ID
app.get('/admin/users/:id', async (req, res) => {
    try {
        const user = await daoPostgres.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(new UserDTO(user));
    } catch (err) {
        console.error('❌ Error al obtener usuario:', err.message);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// ✅ RUTA: Editar usuario
app.put('/admin/users/:id', async (req, res) => {
    try {
        const updatedUser = await daoPostgres.updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado correctamente', user: updatedUser });
    } catch (err) {
        console.error('❌ Error al actualizar usuario:', err.message);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// ✅ RUTA: Eliminar usuario
app.delete('/admin/users/:id', async (req, res) => {
    try {
        const deletedUser = await daoPostgres.deleteUser(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        console.error('❌ Error al eliminar usuario:', err.message);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});



/**
 * Rutas para Candidatos
 */

app.post('/admin/candidatos', async (req, res) => {
    try {
        const { cedula, nombre, apellido, partido, numeroLista } = req.body;

        if (!cedula || !nombre || !apellido || !partido || !numeroLista) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const newCandidato = await daoPostgres.createCandidato({ cedula, nombre, apellido, partido, numeroLista });

        res.status(201).json({ message: 'Candidato registrado exitosamente', candidato: newCandidato });
    } catch (err) {
        console.error('❌ Error al registrar candidato:', err.message);
        res.status(500).json({ error: 'Error al registrar candidato' });
    }
});

app.get('/admin/candidatos', verifyToken, async (req, res) => {
    try {
        const candidatos = await daoPostgres.getCandidatos();
        const candidatosDTO = candidatos.map(candidato => new CandidatoDTO(candidato)); // Convierte a DTO
        res.json(candidatosDTO);
    } catch (err) {
        console.error('❌ Error al obtener candidatos:', err.message);
        res.status(500).json({ error: 'Error al obtener candidatos' });
    }
});


app.put('/admin/candidatos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { cedula, nombre, apellido, partido, numeroLista } = req.body;

        const updatedCandidato = await daoPostgres.updateCandidato(id, { cedula, nombre, apellido, partido, numeroLista });

        res.json({ message: 'Candidato actualizado correctamente', candidato: updatedCandidato });
    } catch (err) {
        console.error('❌ Error al actualizar candidato:', err.message);
        res.status(500).json({ error: 'Error al actualizar candidato' });
    }
});

app.delete('/admin/candidatos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await daoPostgres.deleteCandidato(id);
        res.json({ message: 'Candidato eliminado correctamente' });
    } catch (err) {
        console.error('❌ Error al eliminar candidato:', err.message);
        res.status(500).json({ error: 'Error al eliminar candidato' });
    }
});


app.get('/admin/vote-logs-detailed', async (req, res) => {
    try {
        const logs = await voteService.getDetailedVoteLogs();
        res.json(logs);
    } catch (err) {
        console.error('❌ Error al obtener logs detallados:', err.message);
        res.status(500).json({ error: 'Error al obtener logs detallados' });
    }
});




/**
 * MONGODB
 */


// ✅ Ruta para obtener los logs de votación desde MongoDB
app.get('/admin/vote-logs', async (req, res) => {
    try {
        const logs = await daoMongo.getAuditLogs();
        res.json(logs);
    } catch (err) {
        console.error('❌ Error al obtener logs de votos:', err.message);
        res.status(500).json({ error: 'Error al obtener logs de auditoría' });
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



