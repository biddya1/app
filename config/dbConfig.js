const { Sequelize, DataTypes } = require("sequelize");

// DB configuration
const dbConfig = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "project",
  dialect: "mysql",
  PORT: 3306,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
};

// Initialize Sequelize
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.PORT,
    pool: dbConfig.pool,
    logging: false,
  }
);

// Import models
const User = require("../model/user")(sequelize, DataTypes);
const Blog = require("../model/blogModel")(sequelize, DataTypes);

// Define associations
User.hasMany(Blog, { foreignKey: "userId", onDelete: "CASCADE" });
Blog.belongsTo(User, { foreignKey: "userId" });

// Optional: sync database
sequelize
  .sync({ alter: true }) // use { force: true } if you want to drop & recreate tables
  .then(() => console.log("Database & tables synced"))
  .catch((err) => console.error("DB sync error:", err));

module.exports = { sequelize, User, Blog };
