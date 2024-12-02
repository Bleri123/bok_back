import express from "express";
import {
  login,
  register,
  changeUserPin,
} from "../controllers/authController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { isActive } from "../middlewares/isActive.js";
import authenticateToken from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/isAdmin", authenticateToken, isAdmin, (req, res) => {
  res.status(200).json({
    isAdmin: true,
  });
});
router.put(
  "/change-user-pin",
  authenticateToken,
  isActive,
  isAdmin,
  changeUserPin
);

export default router;
