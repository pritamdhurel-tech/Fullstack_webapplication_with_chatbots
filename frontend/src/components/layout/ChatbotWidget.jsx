// src/components/layout/ChatbotWidget.jsx
// Real AI chatbot powered by Groq API (Llama 3)
// FR7 — responds to questions about services, solutions, and events
// FR8 — fallback message for out-of-scope queries (enforced by backend system prompt)

import { useState, useRef, useEffect } from "react";

const FALLBACK =
  "I'm sorry, I'm unable to answer that. Please use our Contact Us form or email us.";

const INITIAL_MESSAGE = {
  from: "bot",
  text: "Hi! I'm the AI-Solutions assistant. I can answer questions about our services, software solutions, and upcoming events. How can I help?",
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { from: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          // Send conversation history so Groq has context
          history: messages.filter((m) => m.from !== "typing"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [...prev, { from: "bot", text: FALLBACK }]);
        return;
      }

      setMessages((prev) => [...prev, { from: "bot", text: data.reply }]);
    } catch {
      // Network error — show fallback
      setMessages((prev) => [...prev, { from: "bot", text: FALLBACK }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* ── Chat window ─────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed bottom-24 right-7 z-50 w-80 flex flex-col
                        bg-[#0D1120] border border-white/10 rounded-[18px]
                        overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4
                          bg-gradient-to-r from-accent/10 to-[#00D4AA]/5
                          border-b border-white/10"
          >
            <div
              className="w-2 h-2 rounded-full bg-[#00D4AA]
                            [animation:pulse2_2s_infinite] flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#F0F0F5]">
                AI Assistant
              </p>
              <p className="text-[11px] text-[#8A8FA8]">
                Services · Solutions · Events
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-[#4A4F66] hover:text-[#F0F0F5] text-xl leading-none
                         bg-transparent border-0 cursor-pointer flex-shrink-0"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex flex-col gap-2.5 px-4 py-4
                          max-h-72 overflow-y-auto min-h-[120px]"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-[13px]
                            leading-relaxed ${
                              m.from === "bot"
                                ? "self-start bg-white/[0.06] border border-white/10 text-[#F0F0F5] rounded-bl-sm"
                                : "self-end bg-accent text-white rounded-br-sm"
                            }`}
              >
                {m.text}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div
                className="self-start bg-white/[0.06] border border-white/10
                              rounded-xl rounded-bl-sm px-4 py-3 flex gap-1.5"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#8A8FA8]
                                 animate-bounce [animation-delay:0ms]"
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#8A8FA8]
                                 animate-bounce [animation-delay:150ms]"
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#8A8FA8]
                                 animate-bounce [animation-delay:300ms]"
                />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 px-3 py-3 border-t border-white/10">
            <input
              className="form-input flex-1 py-2 text-[13px]"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-9 h-9 flex items-center justify-center rounded-lg
                         bg-accent text-white text-base border-0 cursor-pointer
                         hover:opacity-85 transition-opacity
                         disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              ↑
            </button>
          </div>

          {/* Scope notice */}
          <p className="text-[10px] text-[#4A4F66] text-center pb-2.5 px-4">
            Answers limited to AI-Solutions services, solutions &amp; events
          </p>
        </div>
      )}

      {/* ── FAB ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-7 right-7 z-50 w-14 h-14 rounded-full
                   bg-gradient-to-br from-accent to-[#00D4AA] text-white
                   text-2xl border-0 cursor-pointer flex items-center justify-center
                   shadow-[0_8px_24px_rgba(108,99,255,0.5)]
                   hover:scale-105 transition-transform duration-200"
        title="Chat with our AI assistant"
      >
        {open ? "×" : "💬"}
      </button>
    </>
  );
}
