module.exports = {
    elastic: {
        host: '127.0.0.1',
        port: 9200,
    },
    database: {
        dbname: 'testdb',
        username: 'root',
        password: '123456',
        info: {
            dialect: 'mysql',
            host: '127.0.0.1',
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            logging: false,
        }
    },
};