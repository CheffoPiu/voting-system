const { Pool } = require('pg');

class PostgresDAO {
    constructor() {
        this.pool = new Pool({
            user: 'admin',
            host: 'postgres',
            database: 'voting_system',
            password: 'admin',
            port: 5432,
        });
    }

    async connect() {
        try {
            await this.pool.query('SELECT NOW()');
            console.log('Conexión a PostgreSQL exitosa.');
        } catch (err) {
            console.error('Error al conectar a PostgreSQL:', err.message);
            throw err;
        }
    }

    async createVote(userId, option) {
        try {
            await this.pool.query(
                'INSERT INTO votes (user_id, option) VALUES ($1, $2)',
                [userId, option]
            );
        } catch (err) {
            console.error('Error al insertar voto en PostgreSQL:', err.message);
            throw err;
        }
    }

    async getResults() {
        try {
            const results = await this.pool.query(
                'SELECT option, COUNT(*) as votes FROM votes GROUP BY option'
            );
            return results.rows;
        } catch (err) {
            console.error('Error al obtener resultados de PostgreSQL:', err.message);
            throw err;
        }
    }
}

module.exports = PostgresDAO;
