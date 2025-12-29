const express = require("express");
const path = require("path");
const db = require("./config/dbConfig");
const blogRoutes = require("./routes/blogRoutes");
const userRoute = require("./routes/userRoute");

const sequelize = db.sequelize;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/", blogRoutes);
app.use("/", userRoute);


const PORT = 3000;

sequelize.sync({ force: false }).then(() => {
  console.log("Database synced");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
