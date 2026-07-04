// src/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Route imports
const authRouter = require("./routes/auth");
const contactRouter = require("./routes/contact");
const solutionsRouter = require("./routes/solutions");
const pastWorkRouter = require("./routes/pastWork");
const feedbackRouter = require("./routes/feedback");
const galleryRouter = require("./routes/gallery");
const eventsRouter = require("./routes/events");
const articlesRouter = require("./routes/articles");
const enquiriesRouter = require("./routes/enquiries");
const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT ?? 5000;

// ── Middleware ────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Public routes ─────────────────────────────────────────────────
app.use("/api/auth", authRouter); // POST /api/auth/login
app.use("/api/contact", contactRouter); // POST /api/contact
app.use("/api/solutions", solutionsRouter); // GET  /api/solutions
app.use("/api/past-work", pastWorkRouter); // GET  /api/past-work
app.use("/api/feedback", feedbackRouter); // GET  /api/feedback
app.use("/api/gallery", galleryRouter); // GET  /api/gallery
app.use("/api/events", eventsRouter); // GET  /api/events
app.use("/api/articles", articlesRouter); // GET  /api/articles
app.use("/api/chat", chatRouter); // POST /api/chat — Groq AI chatbot

// ── Admin-only routes (protected by auth middleware inside each router) ──
app.use("/api/enquiries", enquiriesRouter); // GET  /api/enquiries (FR11)

// ── 404 handler ───────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ── Global error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error." });
});

// ── Start server ──────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`AI-Solutions backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
