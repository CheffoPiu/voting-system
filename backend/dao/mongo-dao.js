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

    async createVote(userId, option) {
        try {
            const collection = this.db.collection('votes');
            await collection.insertOne({ userId, option });
        } catch (err) {
            console.error('Error al insertar voto en MongoDB:', err.message);
            throw err;
        }
    }

    async getResults() {
        try {
            const collection = this.db.collection('votes');
            const results = await collection.aggregate([
                { $group: { _id: '$option', votes: { $count: {} } } },
            ]).toArray();

            return results.map((result) => ({
                option: result._id,
                votes: result.votes,
            }));
        } catch (err) {
            console.error('Error al obtener resultados de MongoDB:', err.message);
            throw err;
        }
    }
}

module.exports = MongoDAO;
