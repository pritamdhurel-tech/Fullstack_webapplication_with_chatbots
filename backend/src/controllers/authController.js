// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

async function login(req, res) {
  const { username, password, captchaToken } = req.body;

  // ── CAPTCHA verification ──────────────────────────────────────
  try {
    const captchaRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`,
      { method: "POST" },
    );
    const captchaData = await captchaRes.json();
    if (!captchaData.success) {
      return res
        .status(400)
        .json({ error: "CAPTCHA verification failed. Please try again." });
    }
  } catch {
    return res
      .status(500)
      .json({ error: "Could not verify CAPTCHA. Please try again." });
  }

  // ── Credential check ──────────────────────────────────────────
  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN ?? "8h" },
    );

    res.json({ token, username: admin.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
}

module.exports = { login };
