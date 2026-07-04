import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// FR5 — all 7 required fields: name, email, phone, company, country, job title, job details
// FR6 — on success, API sends confirmation email to both customer and admin

const INITIAL = {
  full_name: "",
  email: "",
  phone: "",
  company_name: "",
  country: "",
  job_title: "",
  job_details: "",
};

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Germany",
  "France",
  "India",
  "Australia",
  "Canada",
  "Other",
];

export default function Contact() {
  const location = useLocation();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [inquiryContext, setInquiryContext] = useState(null);

  function validate() {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email address.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone))
      e.phone = "Please enter a valid phone number.";
    if (!form.company_name.trim()) e.company_name = "Company name is required.";
    if (!form.country) e.country = "Please select a country.";
    if (!form.job_title.trim()) e.job_title = "Job title is required.";
    if (!form.job_details.trim()) e.job_details = "Job details are required.";
    return e;
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");
    const name = params.get("name");

    if (type && name) {
      const label =
        type === "event"
          ? "this event"
          : type === "solution"
            ? "this solution"
            : type === "project"
              ? "this project"
              : "this topic";

      setInquiryContext({ name, label });
      setForm((prev) => ({
        ...prev,
        job_details:
          prev.job_details ||
          `I’m interested in ${name}. Please share more details about ${label} and the next steps for registration or a consultation.`,
      }));
    } else {
      setInquiryContext(null);
    }
  }, [location.search]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
      setForm(INITIAL);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-20">
      <p className="section-label">Get in touch</p>
      <h1 className="section-title">
        Tell us about
        <br />
        your project
      </h1>

      {inquiryContext && (
        <div className="mt-8 rounded-xl border border-[#00D4AA]/20 bg-[#00D4AA]/10 p-4 text-sm text-[#00D4AA]">
          <p className="font-semibold">
            Inquiry context: {inquiryContext.name}
          </p>
          <p className="mt-1 text-[#8A8FA8]">
            We’ve prepared the form for your request about{" "}
            {inquiryContext.label}. You can edit the details before sending.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12 items-start">
        {/* Left — contact info */}
        <div>
          <p className="text-[#8A8FA8] text-base leading-relaxed mb-8">
            No account needed. Fill in the form with your job requirements and
            we'll be in touch within 24 hours. Both you and our admin team will
            receive a confirmation email on submission.
          </p>
          <div className="flex flex-col gap-3 mb-8">
            {[
              { icon: "📍", text: "AI-Solutions, Sunderland, UK" },
              { icon: "✉️", text: "hello@ai-solutions.co.uk" },
              { icon: "📞", text: "+44 (0)191 000 0000" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 text-sm text-[#8A8FA8]"
              >
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-lg bg-[#00D4AA]/5 border border-[#00D4AA]/20">
            <p className="text-sm text-[#00D4AA] font-semibold mb-1">
              ✓ Confirmation email sent automatically
            </p>
            <p className="text-xs text-[#8A8FA8]">
              You'll receive a copy of your submission immediately after
              sending.
            </p>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex flex-col gap-4">
          {status === "success" && (
            <div
              className="p-4 rounded-lg bg-[#00D4AA]/10 border border-[#00D4AA]/30
                            text-sm text-[#00D4AA]"
            >
              ✓ Message sent. Check your inbox for a confirmation email.
            </div>
          )}

          {status === "error" && (
            <div
              className="p-4 rounded-lg bg-[#FF6B6B]/10 border border-[#FF6B6B]/30
                            text-sm text-[#FF6B6B]"
            >
              Something went wrong. Please try again or email us directly.
            </div>
          )}

          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full name *" error={errors.full_name}>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputClass(errors.full_name)}
              />
            </Field>
            <Field label="Email address *" error={errors.email}>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className={inputClass(errors.email)}
              />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone number *" error={errors.phone}>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+44 ..."
                className={inputClass(errors.phone)}
              />
            </Field>
            <Field label="Company name *" error={errors.company_name}>
              <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                placeholder="Your organisation"
                className={inputClass(errors.company_name)}
              />
            </Field>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Country *" error={errors.country}>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className={inputClass(errors.country)}
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Job title *" error={errors.job_title}>
              <input
                name="job_title"
                value={form.job_title}
                onChange={handleChange}
                placeholder="e.g. Head of Digital"
                className={inputClass(errors.job_title)}
              />
            </Field>
          </div>

          {/* Job details */}
          <Field label="Job details *" error={errors.job_details}>
            <textarea
              name="job_details"
              value={form.job_details}
              onChange={handleChange}
              placeholder="Describe your project requirements, goals, and any relevant context..."
              rows={4}
              className={inputClass(errors.job_details)}
            />
          </Field>

          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Sending..." : "Send message →"}
          </button>

          <p className="text-[11px] text-[#4A4F66]">
            All fields are required. Your data is used only to respond to your
            enquiry.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helpers
function inputClass(hasError) {
  return `form-input ${hasError ? "border-[#FF6B6B] focus:border-[#FF6B6B]" : ""}`;
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-wide text-[#8A8FA8] uppercase">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-[#FF6B6B]">{error}</p>}
    </div>
  );
}
