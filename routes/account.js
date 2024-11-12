import authenticateToken from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import {
  fetchAccount,
  fetchAccountByUserId,
} from "../controllers/accountController.js";
import { deleteAccount } from "../controllers/accountController.js";
import { isActive } from "../middlewares/isActive.js";
import express from "express";
const router = express.Router();

router.get("/", authenticateToken, fetchAccount);
router.get(
  "/:user_id",
  authenticateToken,
  isActive,
  isAdmin,
  fetchAccountByUserId
);
router.delete("/delete/:id", authenticateToken, isAdmin, deleteAccount);

export default router;
