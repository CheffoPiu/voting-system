class VoteService {
    constructor(daoPostgres, daoMongo) {
        this.daoPostgres = daoPostgres;
        this.daoMongo = daoMongo;
    }

    async registerVote(userId, candidateId, req) {
        try {

            if (!userId || !candidateId) {
                throw new Error("userId y candidateId son requeridos");
            }
            await this.daoPostgres.createVote(userId, candidateId);
            await this.daoMongo.logVote(userId, candidateId, req);
        } catch (err) {
            console.error('Error en servicio de votación:', err.message);
            throw err;
        }
    }

    async getResults() {
        try {
            // Obtener total de usuarios
            const totalUsers = await this.daoPostgres.getTotalUsers();
            
            // Obtener votos por candidato
            const votes = await this.daoPostgres.getResults();
    
            // Calcular total de votos emitidos
            const totalVotes = votes.reduce((sum, v) => sum + parseInt(v.votos), 0);
    
            // Calcular porcentaje de cada candidato
            const results = votes.map(vote => ({
                candidateId: vote.id,
                name: vote.nombre,
                party: vote.partido,
                votes: vote.votos,
                percentage: totalVotes > 0 ? ((vote.votos / totalVotes) * 100).toFixed(2) : 0
            }));
    
            // Calcular cantidad de personas que aún no han votado
            const usersWhoDidNotVote = totalUsers - totalVotes;
    
            return {
                totalUsers,
                totalVotes,
                usersWhoDidNotVote,
                results
            };
        } catch (err) {
            console.error('Error al obtener resultados en servicio:', err.message);
            throw err;
        }
    }

    async getDetailedVoteLogs() {
        try {
            // 1️⃣ Obtener logs de votación desde MongoDB
            const logs = await this.daoMongo.getAuditLogs();
            if (logs.length === 0) {
                return [];
            }
    
            // 2️⃣ Extraer IDs únicos de usuarios y candidatos
            const userIds = [...new Set(logs.map(log => log.userId))];
            const candidateIds = [...new Set(logs.map(log => log.candidateId))];
    
            // 3️⃣ Obtener datos de usuarios y candidatos desde PostgreSQL
            const users = await this.daoPostgres.getUsersByIds(userIds);
            const candidates = await this.daoPostgres.getCandidatesByIds(candidateIds);
 

            // 4️⃣ Combinar información de usuarios, candidatos y logs
            const enrichedLogs = logs.map(log => {
                const user = users.find(u => u.id == log.userId);
                const candidate = candidates.find(c => c.id == log.candidateId);
                console.log("user",user)
                return {
                    timestamp: log.timestamp,
                    nombre: user?.nombre || 'Desconocido',
                    apellido: user?.apellido || '',
                    cedula: user?.cedula || '',
                    email: user?.email || '',
                    candidateId: log.candidateId,
                    candidato: candidate?.nombre || 'Desconocido',
                    partido: candidate?.partido || 'N/A',
                    origin: log.origin,
                    userAgent: log.userAgent
                };
            });
    
            return enrichedLogs;
        } catch (err) {
            console.error('❌ Error al obtener logs combinados:', err.message);
            throw err;
        }
    }

    
    
}

module.exports = VoteService;
