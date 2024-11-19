import authenticateToken from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isActive } from "../middlewares/isActive.js";
import { fetchAccount, fetchAccountByUserId, getAccountsReports } from "../controllers/accountController.js";
import { deleteAccount } from '../controllers/accountController.js';
import express from 'express';
const router = express.Router();

router.get("/", authenticateToken, fetchAccount);
router.get('/reports', authenticateToken, getAccountsReports)
router.delete('/delete/:id', authenticateToken, isAdmin, deleteAccount);
router.get(
  "/:user_id",
  authenticateToken,
  isActive,
  isAdmin,
  fetchAccountByUserId
);

export default router;