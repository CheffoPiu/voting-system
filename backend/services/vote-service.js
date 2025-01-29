class VoteService {
    constructor(dao) {
        this.dao = dao;
    }

    async registerVote(userId, option) {
        try {
            await this.dao.createVote(userId, option);
        } catch (err) {
            console.error('Error en servicio de votación:', err.message);
            throw err;
        }
    }

    async getResults() {
        try {
            return await this.dao.getResults();
        } catch (err) {
            console.error('Error al obtener resultados en servicio:', err.message);
            throw err;
        }
    }
}

module.exports = VoteService;
