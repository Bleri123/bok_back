import authenticateToken from "../middlewares/authMiddleware.js";
import { isActive } from "../middlewares/isActive.js";
import express from "express";
import {
  deposit,
  getTransactionHistory,
  sendMoney,
} from "../controllers/transactionController.js";
const router = express.Router();

router.get("/", authenticateToken, isActive, getTransactionHistory);
router.post("/deposit", authenticateToken, isActive, deposit);
router.post("/send-money", authenticateToken, isActive, sendMoney);

export default router;
