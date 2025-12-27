const { Sequelize, DataTypes } = require("sequelize");

// Database credentials
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
        idle: 10000
    }
};

// Sequelize instance
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: dbConfig.pool
    }
);

// Test connection
sequelize.authenticate()
    .then(() => console.log("Database connected!"))
    .catch(err => console.error("DB connection error:", err));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.blogs = require("../model/blogModel")(sequelize, DataTypes);
db.users = require("../model/userModel")(sequelize, DataTypes);

// Sync database
db.sequelize.sync({ force: false })
    .then(() => console.log("Database synced!"));

module.exports = db;
