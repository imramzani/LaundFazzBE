const ControllerCustomer = require("../controllers/user");
const { sequelize } = require("../../models");
const { queryInterface } = sequelize;
const request = require("supertest");
const app = require("../../app");
const { User, Bookmark, Job, Company } = require("../../models");
const fs = require("fs");

const access_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JJZCI6NDE2LCJlbWFpbCI6InRoZWJsYWNrc3dvcmRzbWFuOTVAZ21haWwuY29tIiwidXNlcm5hbWUiOiJzdGV2ZW4gYW5kcmUiLCJyb2xlIjoic3RhZmYiLCJpYXQiOjE2NDUyODEyODAsImV4cCI6MTY0NTI4NDg4MH0.0x65CjMY4I3gYknqRmzHKd4g0AHF-NNS4mYR6y5ectA";

let registerData = {
  email: "tested@test.com",
  password: "tested1",
  phoneNumber: "tested1",
  address: "tested1",
};
beforeAll(async () => {
  try {
    let data = JSON.parse(fs.readFileSync("./data/jobs.json", "utf-8"));
    data.forEach((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
    });
    // console.log(data, `data`);
    await queryInterface.bulkInsert("Jobs", data);
  } catch (error) {
    console.log(error);
  }
});
afterAll(async () => {
  await queryInterface.bulkDelete("Jobs", null);
});