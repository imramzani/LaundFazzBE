const ControllerCustomer = require("../controllers/customers");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const request = require("supertest");
const app = require("../app");
const { User, Bookmark, Job, Company } = require("../models");
const fs = require("fs");
const { hash } = require("../helpers/bcrypt.js");

const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b21lcklkIjoxLCJlbWFpbCI6ImFuZHJpemFsLmNzQGdtYWlsLmNvbSIsImlhdCI6MTY1MDIyMDk2NX0.3aNbVzTNVCDI1Oubicm6eqbbFuXLV6Aa83cps_g4t4w";

let registerData = {
  email: "tested@gmail.com",
  password: "tested1",
  phoneNumber: "tested1",
  name: "test",
};
beforeAll(async () => {
  try {
    let data = JSON.parse(fs.readFileSync("./data/customers.json", "utf-8"));
    data.forEach((el) => {
      el.password = hash(el.password);
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Customers", data);
  } catch (error) {
    console.log(error);
  }
});
afterAll(async () => {
  await queryInterface.bulkDelete("Customers", null);
});

describe(`POST /customer/register`, () => {
  describe(`POST /customer/register sukses`, () => {
    it(`should return an object with status 201`, async () => {
      const res = await request(app)
        .post("/customers/register")
        .send(registerData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("id", expect.any(Number));
      expect(res.body).toHaveProperty("email");
      expect(res.body).toHaveProperty("email", expect.any(String));
      expect(res.body).toHaveProperty("email", registerData.email);
      expect(res.body).toHaveProperty("password");
      expect(res.body).toHaveProperty("password", expect.any(String));
      expect(res.body).toHaveProperty("phoneNumber");
      expect(res.body).toHaveProperty("phoneNumber", expect.any(String));
      expect(res.body).toHaveProperty("phoneNumber", registerData.phoneNumber);
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("name", expect.any(String));
      expect(res.body).toHaveProperty("name", registerData.name);
    });
  });

  describe(`POST /customer/register fail`, () => {
    it(`should be return an object with status 400`, async () => {
      const data = {
        email: null,
        password: "12345",
        phoneNumber: "12345",
        name: "12345",
      };
      const res = await request(app).post("/customers/register").send(data);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "Error",
        expect.arrayContaining([`Customer email cannot be null`])
      );
    });
  });

  describe(`POST /customer/register fail`, () => {
    it(`should be return an object with status 400`, async () => {
      const data = {
        email: "email@yahoo.com",
        password: null,
        phoneNumber: "12345",
        name: "12345",
      };
      const res = await request(app).post("/customers/register").send(data);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "Error",
        expect.arrayContaining([`Customer password cannot be null`])
      );
    });
  });

  describe(`POST /customer/register fail`, () => {
    it(`should be return an object with status 400`, async () => {
      const res = await request(app)
        .post("/customers/register")
        .send(registerData);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "Error",
        expect.arrayContaining([`Customer email must be unique`])
      );
    });
  });

  describe(`POST /customer/register fail`, () => {
    it(`should be return an object with status 400`, async () => {
      const data = {
        email: "wfefcasc",
        password: "12345",
        phoneNumber: "12345",
        name: "12345",
      };
      const res = await request(app).post("/customers/register").send(data);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "Error",
        expect.arrayContaining([`Customer email must be email format`])
      );
    });
  });
});

describe(`POST /customer/login`, () => {
  describe(`POST /customer/login sukses`, () => {
    it(`should return an object with status 200`, async () => {
      const data = { email: "tested@gmail.com", password: "tested1" };
      const res = await request(app).post("/customers/login").send(data);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("access_token");
      expect(res.body).toHaveProperty("access_token", expect.any(String));
    });
  });

  describe(`POST /customer/login fail`, () => {
    it(`should return an object with status 401`, async () => {
      const data = { email: "admin@gmail.com", password: "qwertytre" };
      const res = await request(app).post("/customers/login").send(data);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("Error");
      expect(res.body).toHaveProperty("Error", expect.any(String));
      expect(res.body).toHaveProperty(
        "Error",
        `Wrong customer email or password`
      );
    });

    describe(`POST /customer/login fail`, () => {
      it(`should return an object with status 401`, async () => {
        const data = { email: "emailytrewq@gmail.com", password: "qwertytre" };
        const res = await request(app).post("/customers/login").send(data);
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("Error");
        expect(res.body).toHaveProperty("Error", expect.any(String));
        expect(res.body).toHaveProperty(
          "Error",
          `Wrong customer email or password`
        );
      });
      it(`empty password and email with status 401`, async () => {
        const data = {
          email: "",
          password: "",
        };
        const res = await request(app).post("/customers/login").send(data);
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("Error");
        expect(res.body).toHaveProperty("Error", expect.any(String));
      });
    });
  });
});

describe(`GET /customers/`, () => {
  describe(`GET /customers/ sukses`, () => {
    it(`should return an object with status 200`, async () => {
      const res = await request(app)
        .get("/customers/")
        .send()
        .set("access_token", access_token);
      // console.log(res.body, `ERROR GET`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("id", expect.any(Number));
      expect(res.body).toHaveProperty("email");
      expect(res.body).toHaveProperty("email", expect.any(String));
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("name", expect.any(String));
      expect(res.body).toHaveProperty("phoneNumber");
      expect(res.body).toHaveProperty("phoneNumber", expect.any(String));
    });
  });

  describe(`GET /customers/ fail`, () => {
    it(`should return an object with status 401`, async () => {
      // const wrong_token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b21lcklkIjoxMCwiZW1haWwiOiJhbmRyaXphbC5jc0BnbWFpbC5jb20iLCJpYXQiOjE2NTAyMjAyNTZ9.HG6HH3C-u2e7UpEHvY6YaCBG6Qkwu4FMBpsMKvuzau0";
      const res = await request(app)
        .get("/customers")
        .send()
        .set("access_token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b21lcklkIjoxNCwiZW1haWwiOiJhZG1pbjY5QGdtYWlsLmNvbSIsImlhdCI6MTY1MDM5Mzg3NH0.Tr4CyuEdRe6NQJRZKqoEL1w6_mur1GSZHZevsUbw95s');
      // console.log(res, `ERROR`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("Error");
      expect(res.body).toHaveProperty("Error", expect.any(String));
      expect(res.body).toHaveProperty("Error", "Invalid token or customer");
    });
  });
});
