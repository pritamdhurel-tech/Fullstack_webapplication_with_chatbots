// src/routes/auth.js
const express = require("express");
const { body } = require("express-validator");
const { login } = require("../controllers/authController");
const { handleValidation } = require("../middleware/validate");

const router = express.Router();

router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required."),
    body("password").notEmpty().withMessage("Password is required."),
    body("captchaToken").notEmpty().withMessage("CAPTCHA token is required."),
    handleValidation,
  ],
  login,
);

module.exports = router;
