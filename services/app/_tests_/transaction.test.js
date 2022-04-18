const ControllerCustomer = require("../controllers/customers");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const request = require("supertest");
const app = require("../app");
const fs = require("fs");

const token_user =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b21lcklkIjoxLCJlbWFpbCI6ImFuZHJpemFsLmNzQGdtYWlsLmNvbSIsImlhdCI6MTY1MDIyMDk2NX0.3aNbVzTNVCDI1Oubicm6eqbbFuXLV6Aa83cps_g4t4w";

const token_staff =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdGFmZklkIjoxLCJlbWFpbCI6InNhbWFtYW5kcmUubWFuZHJhY29uQGdtYWlsLmNvbSIsImlhdCI6MTY1MDIyMzk0MH0.CUu5qHMla3qAnsl9u8ezYBDgPa79pZYJ_bfmlHobxJU";

describe(`GET /customers/transactions`, () => {
  describe(`GET /customers/transactions sukses`, () => {
    it(`should return an array of object with status 200`, async () => {
      const res = await request(app)
        .get("/customers/transactions")
        .send()
        .set("access_token", token_user);
      // console.log(res.body, `ERROR GET`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("id", expect.any(Number));
      expect(res.body[0]).toHaveProperty("CustomerId");
      expect(res.body[0]).toHaveProperty("CustomerId", expect.any(Number));
      expect(res.body[0]).toHaveProperty("StaffId");
      expect(res.body[0]).toHaveProperty("StaffId", expect.any(Number));
      expect(res.body[0]).toHaveProperty("isPaid");
      expect(res.body[0]).toHaveProperty("isPaid", expect.any(Boolean));
      expect(res.body[0]).toHaveProperty("status");
      expect(res.body[0]).toHaveProperty("status", expect.any(String));
      expect(res.body[0]).toHaveProperty("pickupDate");
      expect(res.body[0]).toHaveProperty("pickupDate", expect.any(String));
      expect(res.body[1]).toHaveProperty("deliveryDate");
      expect(res.body[1]).toHaveProperty("deliveryDate", expect.any(String));
      expect(res.body[0]).toHaveProperty("longitude");
      expect(res.body[0]).toHaveProperty("longitude", expect.any(String));
      expect(res.body[0]).toHaveProperty("latitude");
      expect(res.body[0]).toHaveProperty("latitude", expect.any(String));
      expect(res.body[0]).toHaveProperty("totalPrice");
      expect(res.body[0]).toHaveProperty("totalPrice", expect.any(Number));
      expect(res.body[0]).toHaveProperty("Customer");
      // expect(res.body[0]).toHaveProperty("Customer", expect.any(String));
      expect(res.body[0].Customer).toHaveProperty("name");
      expect(res.body[0].Customer).toHaveProperty("name", expect.any(String));
    });
  });

  describe(`GET /customers/ fail`, () => {
    it(`should return an object with status 401`, async () => {
      const wrong_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b21lcklkIjoxMCwiZW1haWwiOiJhbmRyaXphbC5jc0BnbWFpbC5jb20iLCJpYXQiOjE2NTAyMjAyNTZ9.HG6HH3C-u2e7UpEHvY6YaCBG6Qkwu4FMBpsMKvuzau0";
      const res = await request(app)
        .get("/customers/transactions")
        .send()
        .set("access_token", wrong_token);
      // console.log(res, `ERROR`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("Error");
      expect(res.body).toHaveProperty("Error", expect.any(String));
      expect(res.body).toHaveProperty("Error", "Invalid token or customer");
    });
  });
});

describe(`GET /staffs/transactions`, () => {
  describe(`GET /staffs/transactions sukses`, () => {
    it(`should return an array of object with status 200`, async () => {
      const res = await request(app)
        .get("/staffs/transactions")
        .send()
        .set("access_token", token_staff);
      // console.log(res.body, `ERROR GET`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(Array.isArray(res.body[0].Products)).toBeTruthy();
      expect(res.body[0].Products.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("id", expect.any(Number));
      expect(res.body[0]).toHaveProperty("CustomerId");
      expect(res.body[0]).toHaveProperty("CustomerId", expect.any(Number));
      expect(res.body[0]).toHaveProperty("StaffId");
      expect(res.body[0]).toHaveProperty("StaffId", expect.any(Number));
      expect(res.body[0]).toHaveProperty("isPaid");
      expect(res.body[0]).toHaveProperty("isPaid", expect.any(Boolean));
      expect(res.body[0]).toHaveProperty("status");
      expect(res.body[0]).toHaveProperty("status", expect.any(String));
      expect(res.body[0]).toHaveProperty("pickupDate");
      expect(res.body[0]).toHaveProperty("pickupDate", expect.any(String));
      expect(res.body[1]).toHaveProperty("deliveryDate");
      expect(res.body[1]).toHaveProperty("deliveryDate", expect.any(String));
      expect(res.body[0]).toHaveProperty("longitude");
      expect(res.body[0]).toHaveProperty("longitude", expect.any(String));
      expect(res.body[0]).toHaveProperty("latitude");
      expect(res.body[0]).toHaveProperty("latitude", expect.any(String));
      expect(res.body[0]).toHaveProperty("totalPrice");
      expect(res.body[0]).toHaveProperty("totalPrice", expect.any(Number));
      expect(res.body[0].Products[0]).toHaveProperty("id");
      expect(res.body[0].Products[0]).toHaveProperty("id", expect.any(Number));
      expect(res.body[0].Products[0]).toHaveProperty("name");
      expect(res.body[0].Products[0]).toHaveProperty(
        "name",
        expect.any(String)
      );
      expect(res.body[0].Products[0]).toHaveProperty("price");
      expect(res.body[0].Products[0]).toHaveProperty(
        "price",
        expect.any(Number)
      );
    });
  });

  describe(`GET /staffs/ fail`, () => {
    it(`should return an object with status 401`, async () => {
      const wrong_token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdGFmZklkIjoxMCwiZW1haWwiOiJzYW1hbWFuZHJlLm1hbmRyYWNvbkBnbWFpbC5jb20iLCJpYXQiOjE2NTAyMjY1NTF9.lV_W6EJyI4u75EbgB5H5LJcIR887HpwC8gfLkUZ5Kuc";
      const res = await request(app)
        .get("/staffs/transactions")
        .send()
        .set("access_token", wrong_token);
      // console.log(res, `ERROR`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("Error");
      expect(res.body).toHaveProperty("Error", expect.any(String));
      expect(res.body).toHaveProperty("Error", "Invalid token or staff");
    });
  });
});

describe(`POST /transactionProducts`, () => {
  describe(`POST /transactionProducts sukses`, () => {
    it(`should return array of object with status 200`, async () => {
      const res = await request(app)
        .get("/transactionProducts")
        .send({ StaffId })
        .set("access_token", token_user);
      expect(res.status).toBe(201);
      expect(res.body).toBeInstanceOf(Object);
    });
  });

  // describe(`POST /transactionProducts sukses`, () => {
  //   it(`should return array of object with status 200`, async () => {
  //     const res = await request(app)
  //       .post("/transactionProducts")
  //       .set("access_token", token_user);
  //     expect(res.status).toBe(200);
  //     expect(res.body).toBeInstanceOf(Object);
  //   });
  // });

  // describe(`POST /transactionProducts sukses`, () => {
  //   it(`should return array of object with status 200`, async () => {
  //     const res = await request(app).get("/transactionProducts");
  //     expect(res.status).toBe(200);
  //     expect(res.body).toBeInstanceOf(Object);
  //   });
  // });
});