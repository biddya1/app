const dbConfig = require('../dbConfig');
const { Sequelize, DataTypes } = require("sequelize");

// sequelize using config values
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// importing model files
db.blogs = require("../model/blogModel.js")(sequelize, DataTypes);
db.users = require("../model/userModel.js")(sequelize, DataTypes);

// ❌ REMOVED authenticate()
// ❌ REMOVED sync() — should be only in index.js

module.exports = db;
