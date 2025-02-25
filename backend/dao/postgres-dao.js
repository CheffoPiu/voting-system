const { Pool } = require('pg');
const bcrypt = require('bcrypt');

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
            // ✅ Encriptar contraseña primero desde Node.js
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // ✅ Llamar al Stored Procedure en PostgreSQL
            const query = `SELECT * FROM sp_create_user($1, $2, $3, $4, $5, $6);`;
            const values = [cedula, nombre, apellido, email, hashedPassword, rol || 'USER'];
    
            const result = await this.pool.query(query, values);
            return result.rows[0]; // Devuelve el usuario creado
        } catch (err) {
            console.error('❌ Error al registrar usuario con SP en PostgreSQL:', err.message);
            throw err;
        }
    }
    


    async getUsers() {
        try {
            const result = await this.pool.query(`SELECT * FROM sp_get_users();`);
            return result.rows;
        } catch (err) {
            console.error('❌ Error al obtener usuarios (SP):', err.message);
            throw err;
        }
    }
    


    async getTotalUsers() {
        try {
            const result = await this.pool.query('SELECT sp_get_total_users() AS total;');
            return parseInt(result.rows[0].total, 10);
        } catch (err) {
            console.error('❌ Error al obtener total usuarios (SP):', err.message);
            throw err;
        }
    }
    
    
     // ✅ Obtener usuario por ID
     async getUsersByIds(userIds) {
        try {
            if (userIds.length === 0) return [];
            const query = `SELECT * FROM sp_get_users_by_ids($1::INT[]);`;
            const result = await this.pool.query(query, [userIds]);
            return result.rows;
        } catch (err) {
            console.error('❌ Error al obtener usuarios por IDs (SP):', err.message);
            throw err;
        }
    }
    

    async getUserByCedula(cedula) {
        try {
            const query = `SELECT * FROM sp_get_user_by_cedula($1::VARCHAR);`;
            const result = await this.pool.query(query, [cedula]);
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error al obtener usuario por cédula (SP):', err.message);
            throw err;
        }
    }
    

     // ✅ Editar usuario
     async updateUser(userId, { cedula, nombre, apellido, email, password, rol }) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = `
                SELECT * FROM sp_update_user(
                    $1::INT, $2::VARCHAR, $3::VARCHAR, $4::VARCHAR, $5::VARCHAR, $6::VARCHAR, $7::VARCHAR
                );`;
            const values = [userId, cedula, nombre, apellido, email, hashedPassword, rol];
            const result = await this.pool.query(query, values);
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error al actualizar usuario (SP):', err.message);
            throw err;
        }
    }
    

    // ✅ Eliminar usuario
    async deleteUser(userId) {
        try {
            const result = await this.pool.query(`SELECT * FROM sp_delete_user($1);`, [userId]);
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
    async createCandidato({ cedula, nombre, apellido, partido, numeroLista }) {
        try {
            const result = await this.pool.query(
                `SELECT * FROM sp_create_candidato($1, $2, $3, $4, $5);`,
                [cedula, nombre, apellido, partido, numeroLista]
            );
            return result.rows[0];
        } catch (err) {
            console.error('❌ Error al registrar candidato en PostgreSQL:', err.message);
            throw err;
        }
    }


    // ✅ Método para listar todos los candidatos
    async getCandidatos() {
        try {
            const result = await this.pool.query(`SELECT * FROM sp_get_candidatos();`);
            return result.rows;
        } catch (err) {
            console.error('❌ Error al obtener candidatos de PostgreSQL:', err.message);
            throw err;
        }
    }


    // ✅ Método para actualizar un candidato
    async updateCandidato(id, { cedula, nombre, apellido, partido, numeroLista }) {
        try {
            const result = await this.pool.query(
                `SELECT * FROM sp_update_candidato($1, $2, $3, $4, $5, $6);`,
                [id, cedula, nombre, apellido, partido, numeroLista]
            );
            return result.rows[0];
        } catch (err) {
            console.error('❌ Error al actualizar candidato en PostgreSQL:', err.message);
            throw err;
        }
    }


    // ✅ Método para eliminar un candidato
    async deleteCandidato(id) {
        try {
            await this.pool.query(`SELECT sp_delete_candidato($1);`, [id]);
        } catch (err) {
            console.error('❌ Error al eliminar candidato en PostgreSQL:', err.message);
            throw err;
        }
    }


    // ✅ Método para obtener candidatos por IDs usando SP
    async getCandidatesByIds(candidateIds) {
        try {
            if (candidateIds.length === 0) return [];
            
            const result = await this.pool.query(
                `SELECT * FROM sp_get_candidates_by_ids($1);`,
                [candidateIds]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error al obtener candidatos por IDs:', err.message);
            throw err;
        }
    }

    
    
    // ✅ Método para registrar un voto usando SP
    async createVote(userId, candidateId) {
        try {
            await this.pool.query(`SELECT sp_create_vote($1, $2);`, [userId, candidateId]);
        } catch (err) {
            console.error('❌ Error al registrar voto en PostgreSQL:', err.message);
            throw err;
        }
    }


    // ✅ Método para obtener resultados usando SP
    async getResults() {
        try {
            const results = await this.pool.query(`SELECT * FROM sp_get_results();`);
            return results.rows;
        } catch (err) {
            console.error('❌ Error al obtener resultados de PostgreSQL:', err.message);
            throw err;
        }
    }

    
}

module.exports = PostgresDAO;
