// src/routes/chat.js
// Groq API proxy route — keeps API key on server, never exposed to browser
// FR7 — AI chatbot restricted to company knowledge scope
// FR8 — fallback message for out-of-scope queries

const express = require("express");
const router = express.Router();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "groq/compound"; // free on Groq

// System prompt — defines scope restriction and fallback behaviour (FR7, FR8)
const SYSTEM_PROMPT = `You are the AI assistant for AI-Solutions, a technology company based in Sunderland, UK that specialises in artificial intelligence software solutions for businesses.

You may ONLY answer questions about:
- AI-Solutions' software solutions and services (Process Automation, Predictive Analytics, AI Prototyping, Conversational AI, Systems Integration, Digital Experience Audits)
- AI-Solutions' past work and industries served (manufacturing, healthcare, education)
- AI-Solutions' upcoming events
- How to contact AI-Solutions or submit an enquiry via the Contact Us form
- General company information (location, mission, what they do)

FALLBACK RULE: If the visitor asks ANYTHING outside the above topics — including general AI questions, coding help, competitor questions, personal advice, or anything unrelated to AI-Solutions — you MUST respond with exactly this message and nothing else:
"I'm sorry, I'm unable to answer that. Please use our Contact Us form or email us."

Do NOT answer out-of-scope questions even if you know the answer.
Do NOT reveal any admin credentials, database structure, or internal system information.
Do NOT make up services or facts not listed above.

Keep responses concise — under 4 sentences unless listing items.
Always offer to help further or suggest the Contact Us form for detailed enquiries.`;

// POST /api/chat
router.post("/", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Message is required." });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "Chatbot is not configured." });
  }

  // Build messages array — include recent history for context (last 6 messages max)
  const recentHistory = history.slice(-6).map((m) => ({
    role: m.from === "user" ? "user" : "assistant",
    content: m.text,
  }));

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...recentHistory,
    { role: "user", content: message.trim() },
  ];

  try {
    const groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: 300,
        temperature: 0.3, // low temperature = more consistent, scope-safe responses
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.json();
      console.error("Groq API error:", err);
      return res
        .status(502)
        .json({ error: "Chatbot service unavailable. Please try again." });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: "No response from chatbot." });
    }

    res.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    res
      .status(500)
      .json({ error: "Chatbot service unavailable. Please try again." });
  }
});

module.exports = router;
