const request = require("supertest");
const app = require("../app"); 
const Product = require("../model/Product");
const fs = require("fs");
const path = require("path");

let server;

beforeAll(() => {
  server = app.listen(3001); // Use a different port to avoid conflicts
});

afterAll(async () => {
  await server.close();
});


// Mock of verifyAdminToken middleware
jest.mock("../middleware/verifyAdminToken", () => jest.fn((req, res, next) => next()));


describe("Product Routes", () => {
  // Test for creating a product
  describe("POST /api/product/create-product", () => {
    it("should create a new product with image and file upload", async () => {
      const productData = {
        title: "Test Product",
        artistName: "Test Artist",
        description: "Test Description",
        old_price: 100,
        new_price: 80,
        category: "Music",
        trending: true,
      };

      // Upload a mock image and file
      const response = await request(app)
        .post("/api/product/create-product")
        .attach("productImage", path.join(__dirname, "testfiles", "testimage.jpg"))
        .attach("productFile", path.join(__dirname, "testfiles", "testfile.pdf"))
        .field(productData)
        .expect(200);

      expect(response.body.message).toBe("Product created successfully");
      expect(response.body.product).toHaveProperty("productImage");
      expect(response.body.product).toHaveProperty("productFile");

      // Clean up uploaded file
      const filePath = path.join(__dirname, "..", "images", response.body.product.productImage.split("/")[2]);
      fs.unlinkSync(filePath); // Delete the uploaded file
    });

    it("should return an error if fields are missing", async () => {
      const productData = {
        title: "Test Product",
        artistName: "Test Artist",
        // Missing other required fields
      };

      const response = await request(app)
        .post("/api/product/create-product")
        .send(productData)
        .expect(400); // Expect a bad request since the fields are incomplete

      expect(response.body.message).toBe("Required fields are missing.");
    });
  });

  // Test for getting all products
  describe("GET /api/product", () => {
    it("should return all products", async () => {
      const response = await request(app)
        .get("/api/product")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  // Test for getting a single product by ID
  describe("GET /api/product/:id", () => {
    it("should return a product by ID", async () => {
      // Create a product to test with
      const productData = {
        title: "Test Product",
        artistName: "Test Artist",
        description: "Test Description",
        old_price: 100,
        new_price: 80,
        category: "Music",
        trending: true,
      };

      const createdProduct = await new Product(productData).save();

      const response = await request(app)
        .get(`/api/product/${createdProduct._id}`)
        .expect(200);

      expect(response.body).toHaveProperty("title", "Test Product");
    });

    it("should return a 404 if product not found", async () => {
      const response = await request(app)
        .get("/api/product/invalid-id")
        .expect(404);

      expect(response.body.message).toBe("Product not found!");
    });
  });

  // Test for updating a product
  describe("PUT /api/product/edit/:id", () => {
    it("should update an existing product when admin is verified", async () => {
      const productData = {
        title: "Updated Product",
        artistName: "Updated Artist",
        description: "Updated Description",
        old_price: 120,
        new_price: 100,
        category: "Music",
        trending: true,
      };

      const createdProduct = await new Product(productData).save();

      const updatedData = {
        title: "Updated Product 2",
        artistName: "Updated Artist 2",
        description: "Updated Description 2",
        old_price: 110,
        new_price: 90,
        category: "Music",
        trending: false,
      };

      const response = await request(app)
        .put(`/api/product/edit/${createdProduct._id}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.message).toBe("Product updated successfully");
      expect(response.body.product.title).toBe(updatedData.title);
    });

    it("should return a 404 if product not found", async () => {
      const response = await request(app)
        .put("/api/product/edit/invalid-id")
        .expect(404);

      expect(response.body.message).toBe("Product not found!");
    });

    it("should return a 403 if admin is not verified", async () => {
      // Disable the middleware temporarily for this test to simulate no admin token
      const response = await request(app)
        .put("/api/product/edit/some-product-id")
        .expect(403); // Forbidden error as admin isn't verified

      expect(response.body.message).toBe("Access denied. Admin token required.");
    });
  });

  // Test for deleting a product
  describe("DELETE /api/product/:id", () => {
    it("should delete a product by ID when admin is verified", async () => {
      const productData = {
        title: "Test Product",
        artistName: "Test Artist",
        description: "Test Description",
        old_price: 100,
        new_price: 80,
        category: "Music",
        trending: true,
      };

      const createdProduct = await new Product(productData).save();

      const response = await request(app)
        .delete(`/api/product/${createdProduct._id}`)
        .expect(200);

      expect(response.body.message).toBe("Product deleted successfully");
    });

    it("should return a 404 if product not found", async () => {
      const response = await request(app)
        .delete("/api/product/invalid-id")
        .expect(404);

      expect(response.body.message).toBe("Product not found!");
    });

    it("should return a 403 if admin is not verified", async () => {
      const response = await request(app)
        .delete("/api/product/some-product-id")
        .expect(403); // Forbidden error as admin isn't verified

      expect(response.body.message).toBe("Access denied. Admin token required.");
    });
  });
});
