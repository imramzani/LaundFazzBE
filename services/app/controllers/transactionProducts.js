const { TransactionProduct, Product, Transaction } = require("../models");
const {
  sequelize,
  Sequelize: { Op },
} = require("../models");
const axios = require("axios");

class Controller {
  static async addTransactionProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { TransactionId, ProductId } = req.body;
      let newTP = await TransactionProduct.create(
        {
          TransactionId,
          ProductId,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json(newTP);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async getTransactionProducts(req, res, next) {
    try {
      const TPs = await TransactionProduct.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Transaction,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Product,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });

      res.status(200).json(TPs);
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionProductById(req, res, next) {
    try {
      const { TPId } = req.params;
      const TP = await TransactionProduct.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: Transaction,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: Product,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
        where: {
          id: TPId,
        },
      });

      if (!TP) {
        throw {
          name: "transactionProductNotFound",
        };
      }
      if (TP.isPaid) {
        res.status(200).json(TP);
      }
      res.status(200).json({ TP, data });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTransactionProduct(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { TPId } = req.params;

      const TP = await TransactionProduct.findByPk(TPId);

      if (!TP) {
        throw { name: "transactionProductNotFound" };
      }

      await TransactionProduct.destroy({
        where: {
          id: TPId,
        },
        transaction: t,
      });

      await t.commit();
      res.status(200).json({ message: `TransactionProduct Deleted` });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
}

module.exports = Controller;
