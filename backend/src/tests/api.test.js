// src/tests/api.test.js
const test = require("node:test");
const assert = require("node:assert");
const http = require("http");
const bcrypt = require("bcryptjs");

// Mock prisma and mailer BEFORE importing app
const prisma = require("../lib/prisma");
const mailer = require("../lib/mailer");

// Mock global fetch for reCAPTCHA verify endpoint
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  if (typeof url === "string" && url.includes("recaptcha/api/siteverify")) {
    const success = url.includes("response=valid-token");
    return {
      status: 200,
      json: async () => ({ success }),
    };
  }
  return originalFetch(url, options);
};

// Simple in-memory mocks
prisma.enquiry = {
  create: async ({ data }) => {
    return {
      id: 999,
      ...data,
      submitted_at: new Date(),
    };
  },
};

prisma.admin = {
  findUnique: async ({ where }) => {
    if (where.username === "admin") {
      return {
        id: 1,
        username: "admin",
        password: bcrypt.hashSync("adminpassword", 10),
        email: "admin@ai-solutions.com",
      };
    }
    return null;
  },
};

// Mock mailer
mailer.sendEnquiryEmails = async (data) => {
  return { messageId: "mock-id" };
};

// Import app after mocking
const app = require("../index");

test("API Endpoints Suite", async (t) => {
  let server;
  let baseUrl;

  // Start temporary server on dynamic port
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });

  // Teardown server after all tests run in this block
  t.after(() => {
    server.close();
    globalThis.fetch = originalFetch; // restore original fetch
  });

  await t.test("GET /api/health - Success", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, "ok");
    assert.ok(body.timestamp);
  });

  await t.test(
    "POST /api/contact - Validation Failure (Missing fields)",
    async () => {
      const res = await fetch(`${baseUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: "John Doe",
          // email, phone, etc are missing
        }),
      });
      assert.strictEqual(res.status, 400);
      const body = await res.json();
      assert.ok(body.errors);
      assert.ok(body.errors.length > 0);
    },
  );

  await t.test("POST /api/contact - Success", async () => {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        company_name: "Example Corp",
        country: "United Kingdom",
        job_title: "Manager",
        job_details: "Looking for AI Solutions integration.",
      }),
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.message, "Enquiry submitted successfully.");
    assert.strictEqual(body.id, 999);
  });

  await t.test(
    "POST /api/auth/login - Failure (Missing captchaToken)",
    async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "admin",
          password: "wrongpassword",
        }),
      });
      assert.strictEqual(res.status, 400);
      const body = await res.json();
      assert.ok(body.errors);
    },
  );

  await t.test(
    "POST /api/auth/login - Failure (CAPTCHA Verification Failure)",
    async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "admin",
          password: "wrongpassword",
          captchaToken: "invalid-token",
        }),
      });
      assert.strictEqual(res.status, 400);
      const body = await res.json();
      assert.strictEqual(
        body.error,
        "CAPTCHA verification failed. Please try again.",
      );
    },
  );

  await t.test(
    "POST /api/auth/login - Failure (Invalid Credentials)",
    async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "wronguser",
          password: "wrongpassword",
          captchaToken: "valid-token",
        }),
      });
      assert.strictEqual(res.status, 401);
      const body = await res.json();
      assert.strictEqual(body.error, "Invalid username or password.");
    },
  );
});
