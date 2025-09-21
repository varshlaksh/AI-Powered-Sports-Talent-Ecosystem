// app.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");
const session = require("express-session");
const userGetRoutes = require("./routes/userGetRoutes");
const userPostRoutes = require("./routes/userPostRoutes");
const performanceRoutes = require("./routes/profile");
require('dotenv').config();

const app = express();

// Set view engine
app.set("view engine", "ejs");

// ============================
// Create uploads folder if missing
// ============================
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("Uploads folder created!");
}

// ============================
// Multer setup for video uploads
// ============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// ============================
// Session middleware
// ============================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "Bitwise_Warriors", // use env variable for production
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

// ============================
// Middleware
// ============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Static files (CSS/JS)

// ============================
// Routes
// ============================

// Main route for video upload form
app.get("/", (req, res) => {
  res.render("index"); // index.ejs form for video upload
});

// User management routes
app.use("/users", userGetRoutes);
app.use("/users", performanceRoutes);
app.use("/users", userPostRoutes);

// Analysis route for video uploads
const analysisRoutes = require("./routes/analysis");
app.use("/", analysisRoutes(upload));

// ============================
// Database Connection + Server Start
// ============================
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "❌ Failed to connect to MongoDB, server not started:",
      err.message
    );
  });