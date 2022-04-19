const { verifyToken } = require("../helpers/jwt");
const { Customer } = require("../models");

let authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    // let access_token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDdXN0b21lcklkIjoxLCJlbWFpbCI6ImN1c3RvbWVyMUBtYWlsLmNvbSIsImlhdCI6MTY1MDE2OTY4MH0.O1EYLAD_DCiruDbFcciO6OXcPJwlnTp5Zj1zRDYZEy4`
    // console.log(access_token, req.headers, `INI HEADERSZ`);
    const payload = verifyToken(access_token);
    const customer = await Customer.findOne({
      where: {
        id: payload.CustomerId,
      },
    });
    console.log(`MASUK AUTHC`, payload, customer,'jembut kontol anjing');
    if (!customer) {
      throw {
        name: `customerAuthc Failed`,
      };
    }

    req.customer = {
      CustomerId: customer.id,
      email: customer.email,
      address: customer.address,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
