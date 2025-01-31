const { MongoClient } = require('mongodb');

class MongoDAO {
    constructor() {
        this.client = new MongoClient('mongodb://mongo:27017');
        this.databaseName = 'voting_system';
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

    async logVote(userId, candidateId) {
        try {
            const collection = this.db.collection('vote_logs');
            await collection.insertOne({ userId, candidateId, timestamp: new Date() });
        } catch (err) {
            console.error('Error al registrar voto en MongoDB:', err.message);
            throw err;
        }
    }

    async getAuditLogs() {
        try {
            return await this.db.collection('audit_logs').find().toArray();
        } catch (err) {
            console.error('Error al obtener logs de MongoDB:', err.message);
            throw err;
        }
    }
}

module.exports = MongoDAO;
