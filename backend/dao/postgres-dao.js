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

            // 1️⃣ Encriptar la contraseña antes de guardarla
            const hashedPassword = await bcrypt.hash(password, 10);

            const query = `
                INSERT INTO usuarios (cedula, nombre, apellido, email, password, rol) 
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
            
            const values = [cedula, nombre, apellido, email, hashedPassword, rol || 'USER'];
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


    async getTotalUsers() {
        try {
            const result = await this.pool.query('SELECT COUNT(*) AS total FROM usuarios;');
            return parseInt(result.rows[0].total, 10); // Convertir a número
        } catch (err) {
            console.error('❌ Error al obtener el total de usuarios:', err.message);
            throw err;
        }
    }
    

     // ✅ Obtener usuario por ID
    async getUsersByIds(userIds) {
        try {
            if (userIds.length === 0) return [];
            const query = `SELECT id, nombre, apellido, email, cedula FROM usuarios WHERE id = ANY($1)`;
            const result = await this.pool.query(query, [userIds]);
            return result.rows;
        } catch (err) {
            console.error('❌ Error al obtener usuarios por IDs:', err.message);
            throw err;
        }
    }


    async getUserByCedula(cedula) {
        try {
            const result = await this.pool.query(
                `SELECT * FROM usuarios WHERE cedula = $1`,
                [cedula]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error al obtener usuario por cédula:', err.message);
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
     async createCandidato({ cedula, nombre, apellido, partido, numeroLista }) {
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
    async getCandidatos() {
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
    async updateCandidato(id, { cedula, nombre, apellido, partido, numeroLista }) {
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
    async deleteCandidato(id) {
        try {
            await this.pool.query('DELETE FROM candidatos WHERE id = $1', [id]);
        } catch (err) {
            console.error('❌ Error al eliminar candidato en PostgreSQL:', err.message);
            throw err;
        }
    }

    async getCandidatesByIds(candidateIds) {
        try {
            if (candidateIds.length === 0) return [];
            const query = `SELECT id, nombre, partido FROM candidatos WHERE id = ANY($1)`;
            const result = await this.pool.query(query, [candidateIds]);
            return result.rows;
        } catch (err) {
            console.error('❌ Error al obtener candidatos por IDs:', err.message);
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
                 JOIN candidatos c ON v.candidate_id = c.id
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
