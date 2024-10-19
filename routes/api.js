import express from "express";
const router = express.Router();
import { getActiveUsers, getAllUsers } from "../controllers/usersController.js";

// Get all users
router.get("/users", getAllUsers);
router.get("/users/active-users", getActiveUsers);

export default router;
