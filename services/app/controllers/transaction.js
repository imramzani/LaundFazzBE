const { Transaction, Product, Customer, TransactionProduct } = require("../models");
const {
  sequelize,
  Sequelize: { Op },
} = require("../models");
const axios = require("axios");

class Controller {
  static async addTransaction(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { StaffId, productArrays, totalPrice } = req.body;
      const { CustomerId } = req.customer;
      console.log(StaffId, CustomerId, `<<<<<<<<<<<<<`);
      let newTransaction = await Transaction.create(
        {
          CustomerId,
          StaffId,
          totalPrice
        },
        { transaction: t }
      );
      
      //!Bulk Create TP
      let TPArrays = productArrays.map((e) => {
        let result = {}
        result.TransactionId = newTransaction.id
        result.ProductId = e
        result.createdAt = new Date();
        result.updatedAt = new Date();
        return result
      });

      let newTP = await TransactionProduct.bulkCreate(TPArrays, {
        transaction: t,
        returning: true
      });

      if (!newTP.length) {
        throw {name: "fail TP bulkCreate"}
      }

      await t.commit();
      res.status(201).json(newTransaction);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async getTransactions(req, res, next) {
    try {
      const { StaffId } = req.staff;
      const transactions = await Transaction.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: Product,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        where: {
          StaffId,
        },
      });
      //! Search by StaffId

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
        include: {
          model: Customer,
          attributes: ["name"],
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
      console.log(req.params, 'kontol2')
      const transaction = await Transaction.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          id: transactionId,
        },
        include: {
          model: Product,
          attributes: { exclude: ["createdAt", "updatedAt"] }
        },
      });
      if (!transaction) {
        throw {
          name: "transactionNotFound",
        };
      }

      if (transaction.status === "pending") {
        const { data } = await axios.post(
          "https://api.xendit.co/v2/invoices",
          {
            external_id:
              transaction.id.toString() +
              "_" +
              transaction.CustomerId.toString() +
              "_" +
              new Date(),
            amount: transaction.totalPrice,
            payer_email: "customer@domain.com",
            description: "Invoice Demo #123",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Basic eG5kX2RldmVsb3BtZW50XzFGRlNzdUF2QXFCaDAwWnJrdWc3ZGJHczY2VllZdjliYmhMb3VESjdYVmR4UWFTNndlYkoyME5iOFppVFZ6Szo=",
            },
          }
        );
        res.status(200).json({ transaction, data });
      } else {
        res.status(200).json(transaction);
      }
    } catch (error) {
      next(error);
    }
  }

  static async editTransaction(req, res, next) {
    const t = await sequelize.transaction();
    try {
      // const {
      //   pickupDate,
      //   deliveryDate,
      //   status,
      //   isPaid,
      //   longitude,
      //   latitude,
      //   totalPrice,
      // } = req.body;
      const { transactionId } = req.params;

      // let temp = {};

      // if (pickupDate) {
      //   temp.pickupDate = pickupDate;
      // }
      // if (deliveryDate) {
      //   temp.deliveryDate = deliveryDate;
      // }
      // if (status) {
      //   temp.status = status;
      // }
      // if (isPaid) {
      //   temp.isPaid = isPaid;
      // }
      // if (longitude) {
      //   temp.longitude = longitude;
      // }
      // if (latitude) {
      //   temp.latitude = latitude;
      // }
      // if (totalPrice) {
      //   temp.totalPrice = latitude;
      // }

      const transaction = await Transaction.findByPk(transactionId);

      if (!transaction) {
        throw { name: "transactionNotFound" };
      }

      let newTransaction = await Transaction.update({status:'done'}, {
        where: {
          id: transactionId,
        },
        returning: true,
        transaction: t,
      });

      await t.commit();
      res.status(200).json(newTransaction[1][0]);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  // static async deleteTransaction(req, res, next) {
  //   const t = await sequelize.transaction();
  //   try {
  //     const { transactionId } = req.params;

  //     const transaction = await Transaction.findByPk(transactionId);

  //     if (!transaction) {
  //       throw { name: "transactionNotFound" };
  //     }

  //     await Transaction.destroy({
  //       where: {
  //         id: transactionId,
  //       },
  //       transaction: t,
  //     });

  //     await t.commit();
  //     res.status(200).json({ message: `Transaction Deleted` });
  //   } catch (error) {
  //     await t.rollback();
  //     next(error);
  //   }
  // }
}

module.exports = Controller;
