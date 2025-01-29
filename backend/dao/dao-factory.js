const PostgresDAO = require('./postgres-dao');
const MongoDAO = require('./mongo-dao');

class DAOFactory {
    static createDAO(dbType) {
        if (dbType === 'postgres') {
            return new PostgresDAO();
        } else if (dbType === 'mongo') {
            return new MongoDAO();
        } else {
            throw new Error('Tipo de base de datos no soportado.');
        }
    }
}

module.exports = DAOFactory;
