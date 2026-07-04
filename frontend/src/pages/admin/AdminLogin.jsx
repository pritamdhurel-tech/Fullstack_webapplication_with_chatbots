// src/pages/admin/AdminLogin.jsx
// FR9 — admin login with CAPTCHA + JWT
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../../hooks/useFetch";
import { showToast } from "../../utils/toast";

// reCAPTCHA v2 site key — replace with your own from console.google.com/recaptcha
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "";

export default function AdminLogin() {
  const navigate = useNavigate();
  const captchaRef = useRef(null);

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load reCAPTCHA script on mount
  useState(() => {
    if (document.getElementById("recaptcha-script")) return;
    const script = document.createElement("script");
    script.id = "recaptcha-script";
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    document.head.appendChild(script);
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit() {
    if (!form.username || !form.password) {
      setError("Please enter your username and password.");
      return;
    }

    // Get CAPTCHA token from rendered widget
    const captchaToken = window.grecaptcha?.getResponse();
    if (!captchaToken) {
      setError("Please complete the CAPTCHA.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        window.grecaptcha?.reset();
        return;
      }

      localStorage.setItem("admin_token", data.token);
      showToast("Login successful", "success");
      navigate("/admin/dashboard");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div className="min-h-screen bg-[#080B12] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold mb-1">
            AI<span className="text-accent">.</span>Solutions
          </h1>
          <p className="text-sm text-[#8A8FA8]">Admin Panel — Sign in</p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1120] border border-white/10 rounded-[14px] p-7">
          {error && (
            <div
              className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 text-[#FF6B6B]
                            text-sm px-4 py-3 rounded-lg mb-5"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5 mb-4">
            <label
              className="text-xs font-semibold tracking-wide
                               text-[#8A8FA8] uppercase"
            >
              Username
            </label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              onKeyDown={handleKey}
              placeholder="admin"
              className="form-input"
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-5">
            <label
              className="text-xs font-semibold tracking-wide
                               text-[#8A8FA8] uppercase"
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKey}
              placeholder="••••••••"
              className="form-input"
              autoComplete="current-password"
            />
          </div>

          {/* reCAPTCHA v2 widget — rendered by Google script */}
          <div className="mb-5 flex justify-center">
            <div
              ref={captchaRef}
              className="g-recaptcha"
              data-sitekey={RECAPTCHA_SITE_KEY}
              data-theme="dark"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50
                       disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <p className="text-center text-xs text-[#4A4F66] mt-5">
          Not publicly accessible — authorised staff only
        </p>
      </div>
    </div>
  );
}
