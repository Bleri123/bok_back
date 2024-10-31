import authenticateToken from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { fetchAccount, fetchAccountByUserId, getallaccount_types } from "../controllers/accountController.js";
import { deleteAccount } from '../controllers/accountController.js';
import express from 'express';
const router = express.Router();


router.get('/', authenticateToken, fetchAccount);
router.get('/:user_id', fetchAccountByUserId);
router.delete('/delete/:id', authenticateToken, isAdmin, deleteAccount);

export default router;