// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db.js");
const apiRoutes = require("./routes/api");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to use routes
app.use("/api", apiRoutes);

// Sample Route
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Test DB connection
db.getConnection((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
