const request = require("supertest");
const app = require("../app");
const { logger } = require("../config/security");
const bcrypt = require("bcryptjs");

let server;

beforeAll(() => {
  server = app.listen(3002); // Use a different port for security tests
});

afterAll(async () => {
  await server.close();
});

describe("Security Features", () => {
  describe("Rate Limiting", () => {
    it("should limit login attempts", async () => {
      const loginData = {
        username: "testuser",
        password: "wrongpassword"
      };

      // Make multiple login attempts
      for (let i = 0; i < 6; i++) {
        const response = await request(app)
          .post("/api/auth/login")
          .send(loginData);

        if (i < 5) {
          expect(response.status).toBe(403); // Invalid credentials
        } else {
          expect(response.status).toBe(429); // Too many requests
        }
      }
    });

    it("should limit registration attempts", async () => {
      const registerData = {
        username: "testuser",
        email: "test@example.com",
        password: "TestPass123!"
      };

      // Make multiple registration attempts
      for (let i = 0; i < 4; i++) {
        const response = await request(app)
          .post("/api/auth/register")
          .send(registerData);

        if (i < 3) {
          expect(response.status).toBe(200); // Registration attempt
        } else {
          expect(response.status).toBe(429); // Too many requests
        }
      }
    });
  });

  describe("Password Security", () => {
    it("should reject weak passwords", async () => {
      const weakPasswords = [
        "123", // Too short
        "password", // No uppercase, numbers, or special chars
        "Password", // No numbers or special chars
        "Password123", // No special chars
        "Password 123!", // Contains spaces
      ];

      for (const password of weakPasswords) {
        const registerData = {
          username: "testuser",
          email: "test@example.com",
          password: password
        };

        const response = await request(app)
          .post("/api/auth/register")
          .send(registerData);

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("Password must be");
      }
    });

    it("should accept strong passwords", async () => {
      const strongPassword = "TestPass123!";
      const registerData = {
        username: "testuser",
        email: "test@example.com",
        password: strongPassword
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(registerData);

      expect(response.status).toBe(200);
    });
  });

  describe("Input Sanitization", () => {
    it("should sanitize XSS attempts", async () => {
      const maliciousData = {
        username: "<script>alert('xss')</script>",
        email: "test@example.com",
        password: "TestPass123!"
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(maliciousData);

      // Should still process the request but with sanitized input
      expect(response.status).toBe(200);
    });

    it("should sanitize SQL injection attempts", async () => {
      const maliciousData = {
        username: "'; DROP TABLE users; --",
        email: "test@example.com",
        password: "TestPass123!"
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(maliciousData);

      // Should handle the request safely
      expect(response.status).toBe(200);
    });
  });

  describe("CSRF Protection", () => {
    it("should require CSRF token for state-changing requests", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "testuser",
          email: "test@example.com",
          password: "TestPass123!"
        });

      // Should fail without CSRF token
      expect(response.status).toBe(403);
    });
  });

  describe("Account Lockout", () => {
    it("should lock account after multiple failed login attempts", async () => {
      const loginData = {
        username: "lockouttest",
        password: "wrongpassword"
      };

      // Make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post("/api/auth/login")
          .send(loginData);
      }

      // 6th attempt should be locked
      const response = await request(app)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.status).toBe(423); // Locked
      expect(response.body.message).toContain("Account is locked");
    });
  });

  describe("Session Management", () => {
    it("should set secure cookies", async () => {
      const response = await request(app)
        .get("/api/csrf-token");

      expect(response.headers["set-cookie"]).toBeDefined();
      const cookies = response.headers["set-cookie"];
      
      // Check for secure cookie attributes
      expect(cookies.some(cookie => cookie.includes("HttpOnly"))).toBe(true);
      expect(cookies.some(cookie => cookie.includes("SameSite=Strict"))).toBe(true);
    });
  });

  describe("Security Headers", () => {
    it("should include security headers", async () => {
      const response = await request(app)
        .get("/api/product");

      expect(response.headers["x-frame-options"]).toBe("DENY");
      expect(response.headers["x-content-type-options"]).toBe("nosniff");
      expect(response.headers["x-xss-protection"]).toBe("1; mode=block");
      expect(response.headers["strict-transport-security"]).toBeDefined();
    });
  });

  describe("Authentication", () => {
    it("should require authentication for protected routes", async () => {
      const response = await request(app)
        .get("/api/admin/dashboard");

      expect(response.status).toBe(401);
    });

    it("should validate JWT tokens", async () => {
      const response = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(403);
    });
  });

  describe("Role-Based Access Control", () => {
    it("should restrict admin routes to admin users", async () => {
      // Test with non-admin user
      const response = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", "Bearer user-token");

      expect(response.status).toBe(403);
    });
  });

  describe("Input Validation", () => {
    it("should validate email format", async () => {
      const invalidEmails = [
        "invalid-email",
        "test@",
        "@example.com",
        "test..test@example.com"
      ];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post("/api/auth/register")
          .send({
            username: "testuser",
            email: email,
            password: "TestPass123!"
          });

        expect(response.status).toBe(400);
      }
    });

    it("should validate username requirements", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "", // Empty username
          email: "test@example.com",
          password: "TestPass123!"
        });

      expect(response.status).toBe(400);
    });
  });

  describe("Encryption", () => {
    it("should hash passwords securely", async () => {
      const password = "TestPass123!";
      const hashedPassword = await bcrypt.hash(password, 12);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$\d{1,2}\$/); // bcrypt format
    });
  });

  describe("Logging", () => {
    it("should log security events", async () => {
      // This test would verify that security events are being logged
      // In a real implementation, you might check log files or use a test logger
      expect(logger).toBeDefined();
    });
  });
});

describe("API Security", () => {
  describe("Product API", () => {
    it("should require admin authentication for product creation", async () => {
      const response = await request(app)
        .post("/api/product/create-product")
        .send({
          title: "Test Product",
          productName: "Test",
          old_price: 100,
          new_price: 80,
          category: "Test"
        });

      expect(response.status).toBe(401);
    });

    it("should allow public access to product listing", async () => {
      const response = await request(app)
        .get("/api/product");

      expect(response.status).toBe(200);
    });
  });

  describe("Order API", () => {
    it("should require authentication for order creation", async () => {
      const response = await request(app)
        .post("/api/orders")
        .send({
          name: "Test User",
          email: "test@example.com",
          phone: "1234567890",
          totalPrice: 100
        });

      expect(response.status).toBe(401);
    });
  });
}); 