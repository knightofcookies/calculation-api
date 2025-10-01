const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");

let userToken;
let adminToken;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await request(app)
    .post("/auth/register")
    .send({ email: "user@example.com", password: "password" });
  const userRes = await request(app)
    .post("/auth/login")
    .send({ email: "user@example.com", password: "password" });
  userToken = userRes.body.token;

  const adminRes = await request(app)
    .post("/auth/login")
    .send({ email: "admin@example.com", password: "adminpassword" });

  if (adminRes.statusCode !== 200) {
    console.error(
      "FATAL TEST ERROR: Admin login failed in test setup:",
      adminRes.body,
    );
  }
  adminToken = adminRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Calculation Endpoints", () => {
  it("should not be accessible without a token", async () => {
    const res = await request(app).get("/calc/add?a=1&b=2");
    expect(res.statusCode).toEqual(401);
  });

  it("should return the sum of two numbers for an authenticated user", async () => {
    const res = await request(app)
      .get("/calc/add?a=5&b=10")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBe(15);
  });
});

describe("Admin Endpoints", () => {
  it("should be inaccessible to a normal user", async () => {
    const res = await request(app)
      .get("/admin/logs")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(403);
  });

  it("should be accessible to an admin user", async () => {
    // First, make a calculation request to generate a log entry
    await request(app)
      .get("/calc/multiply?a=2&b=3")
      .set("Authorization", `Bearer ${userToken}`);

    const res = await request(app)
      .get("/admin/logs")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("logs");
    expect(res.body.logs.length).toBeGreaterThan(0);
    expect(res.body.logs[0].path).toContain("/calc/multiply");
  });
});
