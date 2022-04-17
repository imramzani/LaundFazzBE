const { Customer } = require("../models");

const authorization = async (req, res, next) => {
  try {
    const { CustomerId } = req.customer;

    const auth = await Customer.findByPk(CustomerId);
    if (!auth) {
      throw { name: "customerAuthz Failed" };
    }

    if (auth.id !== CustomerId) {
      throw { name: "customerAuthz Failed" }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorization;
