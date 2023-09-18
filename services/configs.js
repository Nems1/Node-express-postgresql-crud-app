const env = process.env;
const config = {
    db: {
        user: env.DB_USER,
        host: env.HOST_URL,
        port: env.DB_PORT,
        password: env.DB_USER_PASSWD,
        database: env.DB_NAME
    },
    host: {
        host: env.HOST_URL,
        port: env.HOST_PORT,
    },
    listPerPage: env.LIST_PER_PAGE || 10, //Define lines per page
};

module.exports = config ;