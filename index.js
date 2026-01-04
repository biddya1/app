const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser');
const db = require("./config/dbConfig");
const blogRoutes = require("./routes/blogRoutes"); // optional
const userRoute = require("./routes/userRoute");

const sequelize = db.sequelize;
const app = express();

// Set EJS views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());

// Body parser for form submissions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ ROUTE ORDER: userRoute first, blogRoutes second
app.use("/", userRoute);
app.use("/", blogRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// ✅ Sync database with alter:true to fix missing columns
const PORT = 3000;
sequelize.sync({ alter: false }) // change from force:false or alter:false
  .then(() => {
    console.log("Database synced!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("Sync error:", err));
