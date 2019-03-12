let config = {
    isDevelopment: process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development',
    apiPath: '/api',
    maxRouteCallStack: 10,
    server: {
        port: 8091,
    },
    elastic: {
        host: undefined,
        port: undefined,
        prefix: undefined,
    },
    database: {
        dbname: undefined,
        username: undefined,
        password: undefined,
        info: {
            dialect: undefined,
            host: undefined,
        }
    },
};

if (config.isDevelopment)
    Object.assign(config, require('./config.dev'));
else
    Object.assign(config, require('./config.prod'));

module.exports = config;