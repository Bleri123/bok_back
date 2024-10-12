const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// Get all users
router.get("/users", usersController.getAllUsers);
router.get("/users/active-users", usersController.getActiveUsers);

module.exports = router;
