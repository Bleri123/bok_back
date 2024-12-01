import {
  getActiveUsers,
  getAllUsers,
  updateUserByID,
  getUserAccountStatuses,
  getUserRoles,
  userStatusTableUpdateQuery,
} from "../controllers/usersController.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isActive } from "../middlewares/isActive.js";
import express from "express";
const router = express.Router();

router.get("/", authenticateToken, isActive, isAdmin, getAllUsers);
router.get(
  "/active-users",
  authenticateToken,
  isAdmin,
  isActive,
  getActiveUsers
);
router.put("/:id", authenticateToken, isAdmin, isActive, updateUserByID);
router.get(
  "/user-account-statuses",
  authenticateToken,
  isAdmin,
  isActive,
  getUserAccountStatuses
);
router.get("/user-roles", authenticateToken, isActive, getUserRoles);
router.put(
  "/set/user/inactive/:id",
  authenticateToken,
  isAdmin,
  isActive,
  userStatusTableUpdateQuery
);

export default router;
