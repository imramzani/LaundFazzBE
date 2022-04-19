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
});
