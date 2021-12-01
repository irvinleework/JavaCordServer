const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    ssl: process.env.ENVIRONMENT === 'production'
})
module.exports = sequelize;