class VoteService {
    constructor(daoPostgres, daoMongo) {
        this.daoPostgres = daoPostgres;
        this.daoMongo = daoMongo;
    }

    async registerVote(userId, candidateId) {
        try {
            await this.daoPostgres.createVote(userId, candidateId);
            await this.daoMongo.logVote(userId, candidateId);
        } catch (err) {
            console.error('Error en servicio de votación:', err.message);
            throw err;
        }
    }

    async getResults() {
        try {
            return await this.daoPostgres.getResults();
        } catch (err) {
            console.error('Error al obtener resultados en servicio:', err.message);
            throw err;
        }
    }
}

module.exports = VoteService;
