const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const db = require("./config/dbConfig");
const blogRoutes = require("./routes/blogRoutes");
const userRoute = require("./routes/userRoute");

const sequelize = db.sequelize;
const app = express();

// ================= VIEW ENGINE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= MIDDLEWARE =================
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================= STATIC FILES =================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req,res,next)=>{
  res.locals.currentUser = req.cookies.token
  next();
});

// ================= ROUTES =================
// User routes first (login, register)
app.use("/", userRoute);

// Blog routes second
app.use("/", blogRoutes);

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// ================= DATABASE + SERVER =================
const PORT = 3000;

// ❌ DO NOT use alter:true (causes too many keys error)
// ❌ DO NOT use force:true in normal runs
sequelize.sync()
  .then(() => {
    console.log("Database synced!");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch(err => console.error("DB sync error:", err));