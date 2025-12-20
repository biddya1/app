// config/dbConfig.js
const { Sequelize } = require("sequelize");
const dbConfig = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "project",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

// Create Sequelize instance
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
});

module.exports = sequelize;
