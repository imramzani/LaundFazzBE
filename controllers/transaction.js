const { Transaction } = require("../models");
const {
  sequelize,
  Sequelize: { Op },
} = require("../models");

class Controller {
  static async addTransaction(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { StoreId, pickupDate, location } = req.body;
      const { CustomerId } = req.customer;
      let newTransaction = await Transaction.create(
        {
          CustomerId,
          StoreId,
          pickupDate: new Date(),
          location,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json(newTransaction);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async getTransactions(req, res, next) {
    try {
      const transactions = await Transaction.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }

  static async getCustTransactions(req, res, next) {
    try {
      const { CustomerId } = req.customer;
      const transactions = await Transaction.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          CustomerId,
        },
      });

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionById(req, res, next) {
    try {
      const { transactionId } = req.params;
      const transaction = await Transaction.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          id: transactionId,
        },
      });
      if (!transaction) {
        throw {
          name: "transactionNotFound",
        };
      }
      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  static async editTransaction(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { pickupDate, deliveryDate, status, isPaid } = req.body;
      const { transactionId } = req.params;

      const transaction = await Transaction.findByPk(transactionId);

      if (!transaction) {
        throw { name: "transactionNotFound" };
      }

      let newTransaction = await Transaction.update(
        {
          pickupDate,
          deliveryDate,
          status,
          isPaid,
        },
        {
          where: {
            id: transactionId,
          },
          returning: true,
          transaction: t,
        }
      );

      await t.commit();
      res.status(200).json({
        message: "Transaction updated",
        transaction: newTransaction[1][0],
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async deleteTransaction(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { transactionId } = req.params;

      const transaction = await Transaction.findByPk(transactionId);

      if (!transaction) {
        throw { name: "transactionNotFound" };
      }

      await Transaction.destroy({
        where: {
          id: transactionId,
        },
        transaction: t,
      });

      await t.commit();
      res.status(200).json({ message: `Transaction Deleted` });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
}

module.exports = Controller;
