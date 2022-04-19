const { Product } = require("../models");
const {
  sequelize,
  Sequelize: { Op },
} = require("../models");

class Controller {
  static async getProducts(req, res, next) {
    try {
      const products = await Product.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
