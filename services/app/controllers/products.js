const { Product } = require("../models");
const {
  sequelize,
  Sequelize: { Op },
} = require("../models");

class Controller {
  static async addProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { name, price } = req.body;
      let product = await Product.create(
        {
          name,
          price,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json(product);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

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

  static async getProductById(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await Product.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          id: productId,
        },
      });
      if (!product) {
        throw {
          name: "productNotFound",
        };
      }
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async editProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { name, price } = req.body;
      const { productId } = req.params;

      const product = await Product.findByPk(productId);

      if (!product) {
        throw { name: "productNotFound" };
      }

      let newProduct = await Product.update(
        {
          name,
          price,
        },
        {
          where: {
            id: productId,
          },
          returning: true,
          transaction: t,
        }
      );

      await t.commit();
      res.status(200).json({
        message: "Product updated",
        transaction: newProduct[1][0],
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { productId } = req.params;

      const product = await Product.findByPk(productId);

      if (!product) {
        throw { name: "productNotFound" };
      }

      await Product.destroy({
        where: {
          id: productId,
        },
        transaction: t,
      });

      await t.commit();
      res.status(200).json({ message: `Product Deleted` });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
}

module.exports = Controller;
