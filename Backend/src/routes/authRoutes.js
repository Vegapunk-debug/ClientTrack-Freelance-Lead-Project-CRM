const express = require("express");
const { signup, login, updateProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
