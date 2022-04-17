const ControllerCustomer = require("../controllers/customers");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const request = require("supertest");
const app = require("../app");
const { User, Bookmark, Job, Company } = require("../models");
const fs = require("fs");

const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JJZCI6NDE2LCJlbWFpbCI6InRoZWJsYWNrc3dvcmRzbWFuOTVAZ21haWwuY29tIiwidXNlcm5hbWUiOiJzdGV2ZW4gYW5kcmUiLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE2NDUyODEyODAsImV4cCI6MTY0NTI4NDg4MH0.0x65CjMY4I3gYknqRmzHKd4g0AHF-NNS4mYR6y5ectA";

let registerData = {
  email: "tested@gmail.com",
  password: "tested1",
  phoneNumber: "tested1",
  name: "test"
};
// beforeAll(async () => {
//   try {
//     let data = JSON.parse(fs.readFileSync("./data/stores.json", "utf-8"));
//     data.forEach((el) => {
//       el.createdAt = new Date();
//       el.updatedAt = new Date();
//     });
//     await queryInterface.bulkInsert("Stores", data);
//   } catch (error) {
//     console.log(error);
//   }
// });
afterAll(async () => {
  await queryInterface.bulkDelete("Customers", null);
});

describe(`POST /customer/register`, () => {
  describe(`POST /customer/register sukses`, () => {
    it(`should return an object with status 201`, async () => {
      const res = await request(app).post('/customers/register').send(registerData)
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id')
      expect(res.body).toHaveProperty('id', expect.any(Number))
      expect(res.body).toHaveProperty('email')
      expect(res.body).toHaveProperty('email', expect.any(String))
      expect(res.body).toHaveProperty('email', registerData.email)
      expect(res.body).toHaveProperty('password')
      expect(res.body).toHaveProperty('password', expect.any(String))
      expect(res.body).toHaveProperty('phoneNumber')
      expect(res.body).toHaveProperty('phoneNumber', expect.any(String))
      expect(res.body).toHaveProperty('phoneNumber', registerData.phoneNumber)
      // expect(res.body).toHaveProperty('address')
      // expect(res.body).toHaveProperty('address', expect.any(String))
      // expect(res.body).toHaveProperty('address', registerData.address)
      expect(res.body).toHaveProperty('name')
      expect(res.body).toHaveProperty('name', expect.any(String))
      expect(res.body).toHaveProperty('name', registerData.name)
    })
  })

  describe(`POST /customer/register fail`, () => {
    it(`should be return an object with status 400`, async () => {
      const data = { email: null, password: "12345", phoneNumber:"12345", name:"12345" }
      const res = await request(app).post('/customers/register').send(data)
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('Error', expect.arrayContaining([`Customer email cannot be null`]))
    })

  })
  // describe(`POST /customer/register fail`, () => {
  //   it(`should be return an object with status 400`, async () => {
  //     const data = { email: '', password: "12345", phoneNumber:"12345", name:"12345", address:"12345" }
  //     const res = await request(app).post('/customers/register').send(data)
  //     console.log(res.body,'kkkkkkkkk')
  //     expect(res.status).toBe(400)
  //     expect(res.body).toHaveProperty('Error', expect.toContain([`Customer email cannot be null`]))
  //   })
  // })

  describe(`POST /customer/register fail`, () => {
    it(`should be return an object with status 400`, async () => {
      const data = { email: 'email@yahoo.com', password: null, phoneNumber:"12345", name:"12345" }
      const res = await request(app).post('/customers/register').send(data)
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('Error', expect.arrayContaining([`Customer password cannot be null`]))
    })
  })

  // describe(`POST /customer/register fail`, () => {
  //   it(`should be return an object with status 400`, async () => {
  //     const data = { email: 'email@yahoo.com', password: "", phoneNumber:"12345", name:"12345", address:"12345" }
  //     const res = await request(app).post('/customers/register').send(data)
  //     expect(res.status).toBe(400)
  //     expect(res.body).toHaveProperty('Error', expect.arrayContaining([`Customer password cannot be empty", "Customer password length minimum 5 letters`]))
  //   })
  // })

  describe(`POST /customer/register fail`, () => {
    it(`should be return an object with status 400`, async () => {
      const res = await request(app).post('/customers/register').send(registerData)
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('Error', expect.arrayContaining([`Customer email must be unique`]))
    })
  })

  describe(`POST /customer/register fail`, () => {
    it(`should be return an object with status 400`, async () => {
      const data = { email: 'wfefcasc', password: "12345", phoneNumber:"12345", name:"12345" }
      const res = await request(app).post('/customers/register').send(data)
      expect(res.status).toBe(400)
      expect(res.body).toHaveProperty('Error', expect.arrayContaining([`Customer email must be email format`]))
    })
  })
})

describe(`POST /customer/login`, () => {
  describe(`POST /customer/login sukses`, () => {
      it(`should return an object with status 200`, async () => {
          const data = { email: "tested@gmail.com", password: "tested1" }
          const res = await request(app).post('/customers/login').send(data)
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('access_token')
          expect(res.body).toHaveProperty('access_token', expect.any(String))
      })
  })

  describe(`POST /customer/login fail`, () => {
      it(`should return an object with status 401`, async () => {
          const data = { email: "admin@gmail.com", password: "qwertytre" }
          const res = await request(app).post('/customers/login').send(data)
          expect(res.status).toBe(401);
          expect(res.body).toHaveProperty('Error')
          expect(res.body).toHaveProperty('Error', expect.any(String))
          expect(res.body).toHaveProperty('Error', `Wrong customer email or password`)
      })

      describe(`POST /customer/login fail`, () => {
          it(`should return an object with status 401`, async () => {
              const data = { email: "emailytrewq@gmail.com", password: "qwertytre" }
              const res = await request(app).post('/customers/login').send(data)
              expect(res.status).toBe(401);
              expect(res.body).toHaveProperty('Error')
              expect(res.body).toHaveProperty('Error', expect.any(String))
              expect(res.body).toHaveProperty('Error', `Wrong customer email or password`)
          })
      })
  })
})