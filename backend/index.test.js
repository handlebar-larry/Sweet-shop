const mongoose = require("mongoose");
require("dotenv").config();

// Ensure JWT secret exists during tests (prevents crash if not set in .env)
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";

const app = require("./index");
const request = require("supertest");
const User = require("./src/models/user.model");
const Sweet = require("./src/models/sweet.model");
const bcrypt = require("bcrypt");

jest.setTimeout(30000);

let userToken;
let adminToken;

beforeAll(async () => {
  // Connect to test DB
  if (!process.env.MONGOURL_TEST) throw new Error("MONGOURL_TEST missing in .env");
  await mongoose.connect(process.env.MONGOURL_TEST, { dbName: "testdb" });

  // Clean collections so reruns don't fail due to unique constraints
  await User.deleteMany({});
  await Sweet.deleteMany({});

  // -------- Test Data: Base Regular User (used for auth in multiple tests) --------
  await request(app).post("/api/auth/register").send({
    name: "Adi",
    email: "Adi@example.com",
    contact: "9999999999",
    address: "Test house",
    password: "password",
  });

  // -------- Test Data: Login Regular User to get token --------
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "Adi@example.com",
    password: "password",
  });

  userToken = loginRes.body?.token;
  if (!userToken) throw new Error("User login did not return token");

  // -------- Test Data: Base Admin User (created directly with isAdmin=true) --------
  await User.create({
    name: "Admin adi",
    email: "adminadi@example.com",
    contact: "0000000000",
    address: "Admin House",
    password: await bcrypt.hash("adminadi", 10),
    isAdmin: true,
  });

  // -------- Test Data: Login Admin User to get token --------
  const adminLoginRes = await request(app).post("/api/auth/login").send({
    email: "adminadi@example.com",
    password: "adminadi",
  });

  adminToken = adminLoginRes.body?.token;
  if (!adminToken) throw new Error("Admin login did not return token");
});

afterEach(async () => {
  // Cleanup sweets after each test so tests stay independent
  await Sweet.deleteMany({});
});

afterAll(async () => {
  // Final cleanup and close DB connection
  await User.deleteMany({});
  await Sweet.deleteMany({});
  await mongoose.connection.close();
});

// ----------------------
// MongoDB Connection Test
// ----------------------
describe("MongoDB connection", () => {
  it("should be connected", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});

// ----------------------
// Auth Flow Tests
// ----------------------
describe("Auth Flow (Red-Green-Refactor)", () => {
  const userData = {
    name: "Adi 2",
    email: "Adi2@example.com",
    contact: "9999999998",
    address: "Test house2",
    password: "password2",
  };

  it("should register a user", async () => {
    // Test Data: Unique email + contact to avoid duplicates on reruns
    const payload = {
      ...userData,
      email: `Adi2_${Date.now()}@example.com`,
      contact: (`9${Math.floor(Math.random() * 1e9)}`).padEnd(10, "0").slice(0, 10),
    };

    const res = await request(app).post("/api/auth/register").send(payload);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Registered successfully!");
  });

  it("should login with correct credentials", async () => {
    // Test Data: Create a fresh user first, then login with same credentials
    const email = `Adi2_${Date.now()}@example.com`;
    const contact = (`8${Math.floor(Math.random() * 1e9)}`).padEnd(10, "1").slice(0, 10);

    await request(app).post("/api/auth/register").send({
      ...userData,
      email,
      contact,
    });

    // Test Data: Login credentials
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: userData.password });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful!");
    expect(res.body.token).toBeDefined();
  });

  it("should get logged-in user data", async () => {
    // Test Data: Base user token (from beforeAll)
    const res = await request(app)
      .get("/api/auth/getUserData")
      .set("Cookie", `uid=${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("Adi@example.com");
  });

  it("should logout user", async () => {
    // Test Data: Base user token (from beforeAll)
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", `uid=${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out successfully!");
  });
});

// ----------------------
// Sweet API Tests
// ----------------------
describe("Sweet API", () => {
  it("should add a new sweet (admin only)", async () => {
    // Test Data: Sweet creation payload (admin token)
    const res = await request(app)
      .post("/api/sweets")
      .set("Cookie", `uid=${adminToken}`)
      .send({
        name: `Ladoo-${Date.now()}`,
        price: 100,
        category: "Dry",
        quantity: 5,
      });

    expect(res.status).toBe(200);
    expect(res.body.sweet.name).toMatch(/Ladoo/);
  });

  it("should get all sweets (user auth)", async () => {
    // Test Data: Seed one sweet directly in DB
    await Sweet.create({
      name: `Barfi-${Date.now()}`,
      price: 250,
      category: "Milk",
      quantity: 15,
    });

    // Test Data: User token for fetching sweets
    const res = await request(app)
      .get("/api/sweets")
      .set("Cookie", `uid=${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should search sweets by name, category, price range", async () => {
    // Test Data: Seed sweets for search scenario
    const name = `Ladoo-${Date.now()}`;
    await Sweet.create({ name, price: 120, category: "Dry", quantity: 10 });
    await Sweet.create({
      name: `RoyalBarfi-${Date.now()}`,
      price: 250,
      category: "Milk",
      quantity: 50,
    });

    // Test Data: Search filters (range includes price=120)
    const res = await request(app)
      .post("/api/sweets/search")
      .set("Cookie", `uid=${userToken}`)
      .send({ name: "Lad", category: "Dry", pricemin: 100, pricemax: 200 });

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe(name);
  });

  it("should update a sweet (admin only)", async () => {
    // Test Data: Sweet created first, then updated
    const sweet = await Sweet.create({
      name: `KhovaJalebi-${Date.now()}`,
      price: 120,
      category: "Fried",
      quantity: 30,
    });

    // Test Data: Update payload (price change)
    const res = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Cookie", `uid=${adminToken}`)
      .send({ price: 90 });

    expect(res.status).toBe(200);
    expect(res.body.sweet.price).toBe(90);
  });

  it("should delete a sweet (admin only)", async () => {
    // Test Data: Sweet created first, then deleted
    const sweet = await Sweet.create({
      name: `Gulaabjamun-${Date.now()}`,
      price: 30,
      category: "Milk",
      quantity: 50,
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Cookie", `uid=${adminToken}`);

    expect(res.status).toBe(200);

    const dbSweet = await Sweet.findById(sweet._id);
    expect(dbSweet).toBeNull();
  });

  it("should purchase a sweet if in stock (user only)", async () => {
    // Test Data: Sweet with stock=15
    const sweet = await Sweet.create({
      name: `KajuKatli-${Date.now()}`,
      price: 900,
      category: "Dry",
      quantity: 15,
    });

    // Test Data: Purchase quantity=1
    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Cookie", `uid=${userToken}`)
      .send({ quantity: 1 });

    expect(res.status).toBe(200);
    expect(res.body.sweet.quantity).toBe(14);
  });

  it("should fail to purchase if out of stock (user only)", async () => {
    // Test Data: Sweet with stock=0
    const sweet = await Sweet.create({
      name: `Chamcham-${Date.now()}`,
      price: 90,
      category: "Milk",
      quantity: 0,
    });

    // Test Data: Purchase quantity=1
    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set("Cookie", `uid=${userToken}`)
      .send({ quantity: 1 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Sweet is out of stock");
  });

  it("should restock a sweet (admin only)", async () => {
    // Test Data: Sweet with stock=20
    const sweet = await Sweet.create({
      name: `Mishtidoi-${Date.now()}`,
      price: 100,
      category: "Milk",
      quantity: 20,
    });

    // Test Data: Restock quantity=5
    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/restock`)
      .set("Cookie", `uid=${adminToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.sweet.quantity).toBe(25);
  });
});
