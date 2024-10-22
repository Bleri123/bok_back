// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import apiRoutes from "./routes/api.js";
import authRoutes from "./routes/auth.js";
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to use routes
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

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

app.get("/users", async (res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.status(200).json({ Users: rows, status: "success", code: "200" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", status: "fail", code: "500" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
