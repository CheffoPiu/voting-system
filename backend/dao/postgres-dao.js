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


    async createUser({ cedula, nombre, apellido, email, password, rol }) {
        try {
            const query = `
                INSERT INTO usuarios (cedula, nombre, apellido, email, password, rol) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
            
            const values = [cedula, nombre, apellido, email, password, rol || 'USER'];
            const result = await this.pool.query(query, values);

            return result.rows[0]; // Devuelve el usuario creado con ID generado
        } catch (err) {
            console.error('❌ Error al registrar usuario en PostgreSQL:', err.message);
            throw err;
        }
    }


    async getUsers() {
        try {
            const result = await this.pool.query(
                `SELECT id, cedula, nombre, apellido, email, rol FROM usuarios`
            );
            return result.rows; // Devuelve los usuarios en formato de objeto
        } catch (err) {
            console.error('❌ Error al obtener usuarios de PostgreSQL:', err.message);
            throw err;
        }
    }

     // ✅ Obtener usuario por ID
     async getUserById(userId) {
        try {
            const result = await this.pool.query(`SELECT * FROM usuarios WHERE id = $1`, [userId]);
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error al obtener usuario:', err.message);
            throw err;
        }
    }

     // ✅ Editar usuario
     async updateUser(userId, { cedula, nombre, apellido, email, password, rol }) {
        try {
            const query = `
                UPDATE usuarios 
                SET cedula = $1, nombre = $2, apellido = $3, email = $4, password = $5, rol = $6
                WHERE id = $7 RETURNING *;
            `;
            const values = [cedula, nombre, apellido, email, password, rol, userId];
            const result = await this.pool.query(query, values);

            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error al actualizar usuario en PostgreSQL:', err.message);
            throw err;
        }
    }

    // ✅ Eliminar usuario
    async deleteUser(userId) {
        try {
            const result = await this.pool.query(`DELETE FROM usuarios WHERE id = $1 RETURNING *;`, [userId]);
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error al eliminar usuario en PostgreSQL:', err.message);
            throw err;
        }
    }

    /*
    * CANDIDATOS
    */

     // ✅ Método para crear un candidato
     async createCandidate({ cedula, nombre, apellido, partido, numeroLista }) {
        try {
            const query = `
                INSERT INTO candidatos (cedula, nombre, apellido, partido, numero_lista) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
            
            const values = [cedula, nombre, apellido, partido, numeroLista];
            const result = await this.pool.query(query, values);

            return result.rows[0];
        } catch (err) {
            console.error('❌ Error al registrar candidato en PostgreSQL:', err.message);
            throw err;
        }
    }

    // ✅ Método para listar todos los candidatos
    async getCandidates() {
        try {
            const result = await this.pool.query(
                `SELECT id, cedula, nombre, apellido, partido, numero_lista FROM candidatos`
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error al obtener candidatos de PostgreSQL:', err.message);
            throw err;
        }
    }

    // ✅ Método para actualizar un candidato
    async updateCandidate(id, { cedula, nombre, apellido, partido, numeroLista }) {
        try {
            const query = `
                UPDATE candidatos SET cedula = $1, nombre = $2, apellido = $3, partido = $4, numero_lista = $5
                WHERE id = $6 RETURNING *;`;
            
            const values = [cedula, nombre, apellido, partido, numeroLista, id];
            const result = await this.pool.query(query, values);

            return result.rows[0];
        } catch (err) {
            console.error('❌ Error al actualizar candidato en PostgreSQL:', err.message);
            throw err;
        }
    }

    // ✅ Método para eliminar un candidato
    async deleteCandidate(id) {
        try {
            await this.pool.query('DELETE FROM candidatos WHERE id = $1', [id]);
        } catch (err) {
            console.error('❌ Error al eliminar candidato en PostgreSQL:', err.message);
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
