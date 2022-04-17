const { Customer } = require("../models");
const { signToken } = require("../helpers/jwt");
const { compare } = require("../helpers/bcrypt");
const {
  sequelize,
  Sequelize: { Op },
} = require("../models");

class Controller {
  static async register(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { email, password, name, phoneNumber } = req.body;
      let newCustomer = await Customer.create(
        {
          email,
          password,
          name,
          phoneNumber,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json(newCustomer);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) throw { name: "custLogin noInput" };

      let customer = await Customer.findOne({
        where: {
          email: email,
        },
      });

      if (!customer) {
        throw {
          name: "custLogin Failed",
        };
      }

      const comparePassword = compare(password, customer.password);

      if (!comparePassword) {
        throw {
          name: "custLogin Failed",
        };
      }

      const payload = {
        CustomerId: customer.id,
        email: customer.email
      };

      const token = signToken(payload);

      res.status(200).json({ access_token: token });
    } catch (error) {
      next(error);
    }
  }

  static async profile(req, res, next) {
    try {
      const { CustomerId } = req.customer;
      const customer = await Customer.findOne({
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        where: {
          id: CustomerId,
        },
      });
      if (!customer) {
        throw {
          name: "customerNotFound",
        };
      }
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { CustomerId } = req.customer;
      const customer = await Customer.destroy({
        where: {
          id: CustomerId,
        },
        transaction: t,
      });

      await t.commit();
      res.status(200).json({ message: `Customer Deleted` });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
}

module.exports = Controller;
