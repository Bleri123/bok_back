import express from "express";
const router = express.Router();
import {
  getActiveUsers,
  getAllUsers,
  updateUserByID,
} from "../controllers/usersController.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isActive } from "../middlewares/isActive.js";

// Get all users
router.get("/users", authenticateToken, isActive, getAllUsers);
router.get("/users/active-users", getActiveUsers);

// UPDATE
router.put("/user/:id", authenticateToken, isAdmin, isActive, updateUserByID);
export default router;
