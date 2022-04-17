const { Transaction } = require("../models");

const authorization = async (req, res, next) => {
  try {
    const { CustomerId } = req.customer;

    const auth = await Transaction.findOne({
      where: {
        CustomerId
      }
    });
    if (!auth) {
      throw { name: "custTransactionAuthz Failed" };
    }

    if (auth.CustomerId !== CustomerId) {
      throw { name: "custTransactionAuthz Failed" }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorization;
