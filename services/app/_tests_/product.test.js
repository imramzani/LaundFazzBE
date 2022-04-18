const { TransactionProduct, Product, Transaction } = require("../models");
const {
  sequelize,
  Sequelize: { Op },
} = require("../models");
const request = require("supertest");
const app = require("../app");
const axios = require("axios");
const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdGFmZklkIjoxLCJlbWFpbCI6InNhbWFtYW5kcmUubWFuZHJhY29uQGdtYWlsLmNvbSIsImlhdCI6MTY1MDIyMzk0MH0.CUu5qHMla3qAnsl9u8ezYBDgPa79pZYJ_bfmlHobxJU";


describe(`GET /products`, () => {
  describe(`GET /products ssukses`, () => {
    it(`should return an array of object with status 200`, async () => {
      const res = await request(app).get("/products");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  //   describe(`GET /products fail`, () => {
  //     it(`should return an object with status 401`, async () => {
  //       const res = await request(app).get("/products");
  //       expect(res.status).toBe(500);
  //       expect(res.body).toHaveProperty("Error");
  //       expect(res.body).toHaveProperty("Error", expect.any(String));
  //     });
  //   });
});

// describe(`POST /products/`, () => {
//   describe(`POST /products/ sukses`, () => {
//     it(`should return an object with status 201`, async () => {
//       const obj = {
//         name: "Jas Hujan",
//         price: "70000",
//       };
//       const res = await request(app).post(`/products`).set('access_token', access_token).send(obj);
//       expect(res.status).toBe(201);
//       expect(res.body).toHaveProperty("id", expect.any(Number));
//       expect(res.body).toHaveProperty("name", expect.any(String));
//       expect(res.body).toHaveProperty("price", expect.any(Number));
//     });
//   });

  // describe(`POST /products fail`, () => {
  //   it(`should return with status 500`, async () => {
  //     const res = await request(app).get("/products");
  //     expect(res.status).toBe(500);
  //     expect(res.body).toHaveProperty("Error");
  //     expect(res.body).toHaveProperty("Error", expect.any(String));
  //   });
  // });
// });
