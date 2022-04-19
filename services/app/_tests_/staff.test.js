const ControllerCustomer = require("../controllers/customers");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const request = require("supertest");
const app = require("../app");
const { User, Bookmark, Job, Company } = require("../models");
const fs = require("fs");
const { hash } = require("../helpers/bcrypt.js");

const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdGFmZklkIjoxLCJlbWFpbCI6InNhbWFtYW5kcmUubWFuZHJhY29uQGdtYWlsLmNvbSIsImlhdCI6MTY1MDIyMzk0MH0.CUu5qHMla3qAnsl9u8ezYBDgPa79pZYJ_bfmlHobxJU";

let registerData = {
  email: "tested@gmail.com",
  password: "tested1",
};

let loginData = {
  email: "tested@gmail.com",
  password: "tested1",
};
beforeAll(async () => {
  try {
    let data = JSON.parse(fs.readFileSync("./data/staffs.json", "utf-8"));
    data.forEach((el) => {
      el.password = hash(el.password);
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    await queryInterface.bulkInsert("Stores", data);
  } catch (error) {
    console.log(error);
  }
});
afterAll(async () => {
  await queryInterface.bulkDelete("Staffs", null);
});

describe(`POST /Staff/register`, () => {
  describe(`POST /Staff/register sukses`, () => {
    it(`should return an object with status 201`, async () => {
      const res = await request(app)
        .post("/staffs/register")
        .send(registerData);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("id", expect.any(Number));
      expect(res.body).toHaveProperty("email");
      expect(res.body).toHaveProperty("email", expect.any(String));
      expect(res.body).toHaveProperty("email", registerData.email);
      expect(res.body).toHaveProperty("password");
      expect(res.body).toHaveProperty("password", expect.any(String));
    });
  });

  describe(`POST /Staff/register fail`, () => {
    it(`should be return an object with status 400`, async () => {
      const data = {
        email: null,
        password: "12345",
      };
      const res = await request(app).post("/staffs/register").send(data);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "Error",
        expect.arrayContaining([`Staff email cannot be null`])
      );
    });
  });

  describe(`POST /Staff/register fail`, () => {
    it(`should be return an object with status 400`, async () => {
      const data = {
        email: "email@yahoo.com",
        password: null,
      };
      const res = await request(app).post("/staffs/register").send(data);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "Error",
        expect.arrayContaining([`Staff password cannot be null`])
      );
    });
  });

  describe(`POST /Staff/register fail`, () => {
    it(`should be return an object with status 400`, async () => {
      const res = await request(app)
        .post("/staffs/register")
        .send(registerData);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "Error",
        expect.arrayContaining([`Staff email must be unique`])
      );
    });
  });

  describe(`POST /Staff/register fail`, () => {
    it(`should be return an object with status 400`, async () => {
      const data = {
        email: "wfefcasc",
        password: "12345",
      };
      const res = await request(app).post("/staffs/register").send(data);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty(
        "Error",
        expect.arrayContaining([`Staff email must be email format`])
      );
    });
  });
});

describe(`POST /staffs/login`, () => {
  describe(`POST /staffs/login sukses`, () => {
    it(`should return an object with status 201`, async () => {
      const res = await request(app).post("/staffs/login").send(loginData);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("access_token");
      expect(res.body).toHaveProperty("access_token", expect.any(String));
    });
  });

  describe(`POST /staffs/login fail`, () => {
    it(`null password with status 401`, async () => {
      const data = {
        email: "tested@gmail.com",
        password: "",
      };
      const res = await request(app).post("/staffs/login").send(data);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("Error");
      expect(res.body).toHaveProperty("Error", expect.any(String));
    });
    it(`null username with status 401`, async () => {
      const data = {
        email: "",
        password: "testing1",
      };
      const res = await request(app).post("/staffs/login").send(data);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("Error");
      expect(res.body).toHaveProperty("Error", expect.any(String));
    });
    it(`wrong username with status 401`, async () => {
      const data = {
        email: "babayaga",
        password: "testing1",
      };
      const res = await request(app).post("/staffs/login").send(data);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("Error");
      expect(res.body).toHaveProperty("Error", expect.any(String));
    });
    it(`wrong password with status 401`, async () => {
      const data = {
        email: "tested@gmail.com",
        password: "mekari",
      };
      const res = await request(app).post("/staffs/login").send(data);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("Error");
      expect(res.body).toHaveProperty("Error", expect.any(String));
    });
    it(`empty password and email with status 401`, async () => {
      const data = {
        email: "",
        password: "",
      };
      const res = await request(app).post("/staffs/login").send(data);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("Error");
      expect(res.body).toHaveProperty("Error", expect.any(String));
    });
  });
});

describe(`PATCH /staffs`, () => {
  describe(`PATCH /staffs sukses`, () => {
    it(`should return object with status 200`, async () => {
      const data = {
        longitude: "123456",
        latitude: "654321",
      };
      const res = await request(app)
        .patch("/staffs")
        .send(data)
        .set("access_token", access_token);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("id", expect.any(Number));
      expect(res.body).toHaveProperty("email");
      expect(res.body).toHaveProperty("email", expect.any(String));
      expect(res.body).toHaveProperty("latitude");
      expect(res.body).toHaveProperty(
        "latitude",
        expect.any(String),
        data.latitude
      );
      expect(res.body).toHaveProperty("longitude");
      expect(res.body).toHaveProperty(
        "longitude",
        expect.any(String),
        data.longitude
      );
    });
  });
});

describe(`GET /staffs`, () => {
  describe(`GET /staffs sukses`, () => {
    it(`should return an object with status 200`, async () => {
      const res = await request(app).get("/staffs/1")
      expect(res.status).toBe(200);
      // expect(res.body).toHaveProperty("access_token");
      // expect(res.body).toHaveProperty("access_token", expect.any(String));
    });
  });
})

// describe(`DELETE /staffs`, () => {
//   describe(`DELETE /staffs sukses`, () => {
//     it(`should return an object with status 200`, async () => {
//       const res = await request(app).delete("/staffs").send(loginData);
//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty("message");
//       expect(res.body).toHaveProperty("message", expect.any(String));
//     });
//   });

//   describe(`POST /staffs/login fail`, () => {
//     it(`null password with status 401`, async () => {
//       const data = {
//         email: "tested@gmail.com",
//         password: "",
//       };
//       const res = await request(app).post("/staffs/login").send(data);
//       expect(res.status).toBe(401);
//       expect(res.body).toHaveProperty("Error");
//       expect(res.body).toHaveProperty("Error", expect.any(String));
//     });
//     it(`null username with status 401`, async () => {
//       const data = {
//         email: "",
//         password: "testing1",
//       };
//       const res = await request(app).post("/staffs/login").send(data);
//       expect(res.status).toBe(401);
//       expect(res.body).toHaveProperty("Error");
//       expect(res.body).toHaveProperty("Error", expect.any(String));
//     });
//     it(`wrong username with status 401`, async () => {
//       const data = {
//         email: "babayaga",
//         password: "testing1",
//       };
//       const res = await request(app).post("/staffs/login").send(data);
//       expect(res.status).toBe(401);
//       expect(res.body).toHaveProperty("Error");
//       expect(res.body).toHaveProperty("Error", expect.any(String));
//     });
//     it(`wrong password with status 401`, async () => {
//       const data = {
//         email: "tested@gmail.com",
//         password: "mekari",
//       };
//       const res = await request(app).post("/staffs/login").send(data);
//       expect(res.status).toBe(401);
//       expect(res.body).toHaveProperty("Error");
//       expect(res.body).toHaveProperty("Error", expect.any(String));
//     });
//   });
// });
