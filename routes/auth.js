import express from "express";
import { register, login } from "../controllers/authController.js";
import authenticateToken from "../middlewares/authMiddleware.js";
import {isAdmin} from "../middlewares/isAdmin.js";
import {isActive} from "../middlewares/isActive.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/protected", authenticateToken, isActive,isAdmin, (req, res) => {
  res.json({
    message: "You have access to this protected route",
    user: req.user,
  });
});

export default router;
