const { Pool } = require('pg');

class PostgresDAO {
    constructor() {
        this.pool = new Pool({
            user: 'admin',
            host: process.env.POSTGRES_HOST || 'postgres',
            database: process.env.POSTGRES_DB || 'voting_system',
            password: 'admin',
            port: 5432,
        });
    }

     // ✅ Método para conectar y verificar la conexión
     async connect() {
        try {
            const client = await this.pool.connect();
            console.log('✅ Conectado a PostgreSQL correctamente.');
            client.release(); // Liberar conexión
        } catch (err) {
            console.error('❌ Error al conectar a PostgreSQL:', err.message);
            throw err;
        }
    }

      // ✅ Método para cerrar la conexión
      async disconnect() {
        try {
            await this.pool.end();
            console.log('🔌 Conexión a PostgreSQL cerrada.');
        } catch (err) {
            console.error('❌ Error al cerrar conexión PostgreSQL:', err.message);
            throw err;
        }
    }

    async createUser(user) {
        try {
            const query = `INSERT INTO users (id, cedula, nombre, apellido, email, password, rol) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
            await this.pool.query(query, [user.id, user.cedula, user.nombre, user.apellido, user.email, user.password, user.rol || 'USER']);
        } catch (err) {
            console.error('Error al registrar usuario en PostgreSQL:', err.message);
            throw err;
        }
    }

    async createVote(userId, candidateId) {
        try {
            await this.pool.query(
                'INSERT INTO votes (user_id, candidate_id, fecha_voto) VALUES ($1, $2, NOW())',
                [userId, candidateId]
            );
        } catch (err) {
            console.error('Error al registrar voto en PostgreSQL:', err.message);
            throw err;
        }
    }

    async getResults() {
        try {
            const results = await this.pool.query(
                `SELECT c.nombre, c.partido, c.numero_lista, COUNT(v.id) as votos
                 FROM votes v
                 JOIN candidates c ON v.candidate_id = c.id
                 GROUP BY c.id`
            );
            return results.rows;
        } catch (err) {
            console.error('Error al obtener resultados de PostgreSQL:', err.message);
            throw err;
        }
    }
}

module.exports = PostgresDAO;
