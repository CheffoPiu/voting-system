const { MongoClient } = require('mongodb');

class MongoDAO {
    constructor() {
        this.mongoUri = process.env.MONGO_URI || 'mongodb://mongodb:27017';
        this.databaseName = 'voting_system';
        this.client = new MongoClient(this.mongoUri);
        this.db = null;
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('Conexión a MongoDB exitosa.');
            this.db = this.client.db(this.databaseName);
        } catch (err) {
            console.error('Error al conectar a MongoDB:', err.message);
            throw err;
        }
    }

    async disconnect() {
        try {
            await this.client.close();
            console.log('🔌 Conexión a MongoDB cerrada.');
        } catch (err) {
            console.error('❌ Error al cerrar conexión de MongoDB:', err.message);
        }
    }
    

    async logVote(userId, candidateId, req) {
        try {
            const collection = this.db.collection('vote_logs');
            const voteLog = {
                userId,
                candidateId,
                timestamp: new Date(),
                ip: req.ip,  // Captura la IP del usuario
                userAgent: req.headers['user-agent'],  // Captura el dispositivo/navegador
                status: 'SUCCESS', // Puedes cambiarlo a 'FAILED' si hay errores
                origin: req.headers['origin'] // Podrías agregar geolocalización basada en IP
            };
    
            await collection.insertOne(voteLog);
            console.log("✅ Voto registrado en MongoDB:", voteLog);
        } catch (err) {
            console.error('❌ Error al registrar voto en MongoDB:', err.message);
            throw err;
        }
    }
    
    

    async getAuditLogs() {
        try {
            return await this.db.collection('vote_logs').find().toArray();
        } catch (err) {
            console.error('Error al obtener logs de MongoDB:', err.message);
            throw err;
        }
    }
}

module.exports = MongoDAO;
