const { verifyToken } = require("../helpers/jwt");
const { Customer } = require("../models");

let authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
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
