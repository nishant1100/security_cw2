const request = require("supertest");
const app = require("../app"); // Adjust this to point to your app file where express is set up
const Credential = require("../model/Credentials"); // Import the model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


process.env.SECRET_KEY = "8261ba19898d0dcefe6c0c411df74b587b2e54538f5f451633b71e39f957cf01"; //


describe("Authentication Routes", () => {

  // Test for user registration
  describe("POST /api/auth/register", () => {
    it("should register a user and send a verification email", async () => {
      const newUser = {
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
        profilePicture: "profile.jpg",
        bio: "This is a test user",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(newUser)
        .expect(200);

      expect(response.body.message).toBe("Verification email sent. Please check your inbox.");

      // Verify if user was added to the DB (but not saved yet)
      const existingUser = await Credential.findOne({ email: newUser.email });
      expect(existingUser).not.toBeNull();
      expect(existingUser.username).toBe(newUser.username);
    });

    it("should return an error if the user already exists", async () => {
      const existingUser = {
        username: "existinguser",
        email: "existinguser@example.com",
        password: "password123",
        profilePicture: "profile.jpg",
        bio: "This is an existing user",
      };

      // Create the user manually in DB
      await new Credential(existingUser).save();

      const response = await request(app)
        .post("/api/auth/register")
        .send(existingUser)
        .expect(400);

      expect(response.body.message).toBe("Username or email already exists");
    });
  });

  // Test for user email verification
  describe("GET /api/auth/verify", () => {
    it("should verify the user and save them in the database", async () => {
      const newUser = {
        username: "verifyuser",
        email: "verifyuser@example.com",
        password: "password123",
        profilePicture: "profile.jpg",
        bio: "This user will verify",
      };

      const token = jwt.sign(newUser, process.env.SECRET_KEY, { expiresIn: "1h" });

      // Simulate user verification
      const response = await request(app)
        .get(`/api/auth/verify?token=${token}`)
        .expect(302); // Redirect to the frontend on success

      // Check if the user exists in DB after successful verification
      const existingUser = await Credential.findOne({ email: newUser.email });
      expect(existingUser).not.toBeNull();
      expect(existingUser.username).toBe(newUser.username);
    });

    it("should return an error if no token is provided", async () => {
      const response = await request(app)
        .get("/api/auth/verify")
        .expect(400);

      expect(response.body.message).toBe("No token provided");
    });
  });

  // Test for user login
  describe("POST /api/auth/login", () => {
    it("should log in a user and return a token", async () => {
      const user = {
        username: "loginuser",
        email: "loginuser@example.com",
        password: "password123",
        profilePicture: "profile.jpg",
        bio: "User for login test",
      };

      // Create and hash the password before saving to DB
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new Credential({
        ...user,
        password: hashedPassword,
      });

      await newUser.save();

      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "loginuser", password: "password123" })
        .expect(200);

      expect(response.body.message).toBe("Login successful");
      expect(response.body.token).toBeDefined();
    });

    it("should return an error for invalid username or password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "invaliduser", password: "wrongpassword" })
        .expect(403);

      expect(response.body.message).toBe("Invalid username or password");
    });
  });

  // Test for profile picture upload
  describe("POST /api/auth/uploadImage", () => {
    it("should upload a profile picture", async () => {
      // Mock the file upload process using Supertest's file handling
      const response = await request(app)
        .post("/api/auth/uploadImage")
        .attach("profilePicture", "path/to/your/mock/image.jpg") // Use a mock image or actual file
        .expect(200);

      expect(response.body.message).toBe("Image uploaded successfully");
    });

    it("should return an error if no file is uploaded", async () => {
      const response = await request(app)
        .post("/api/auth/uploadImage")
        .expect(400);

      expect(response.body.message).toBe("No file uploaded");
    });
  });
});
