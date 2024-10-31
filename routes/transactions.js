import authenticateToken from '../middlewares/authMiddleware.js';
import { isActive } from '../middlewares/isActive.js';
import express from 'express';
import { getTransactionHistory } from '../controllers/transactionController.js';
const router = express.Router();

router.get('/', authenticateToken, isActive, getTransactionHistory);

export default router;
