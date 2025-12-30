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

sequelize.authenticate()
    .then(() => console.log("Database connected!"))
    .catch(err => console.error("DB connection error:", err));

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Register models
db.User = require("../model/userModel")(sequelize, DataTypes);
db.Blog = require("../model/blogModel")(sequelize, DataTypes);

// ✅ Sync database: create tables or add missing columns
db.sequelize.sync({ alter: true }) // use force: true to drop & recreate table
    .then(() => console.log("Database synced!"))
    .catch(err => console.error("Sync error:", err));

module.exports = db;
