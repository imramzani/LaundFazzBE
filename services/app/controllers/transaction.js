const {
  Transaction,
  Product,
  Customer,
  TransactionProduct,
} = require("../models");
const {
  sequelize,
  Sequelize: { Op },
} = require("../models");
const axios = require("axios");
const {transporter} = require('../helpers/nodemailer')

class Controller {
  static async addTransaction(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { StaffId, productArrays, totalPrice, latitude, longitude } =
        req.body;
      const { CustomerId } = req.customer;
      console.log(StaffId, CustomerId, `<<<<<<<<<<<<<`);
      let newTransaction = await Transaction.create(
        {
          CustomerId,
          StaffId,
          totalPrice,
          latitude,
          longitude,
        },
        { transaction: t }
      );

      //!Bulk Create TP
      let TPArrays = productArrays.map((e) => {
        let result = {};
        result.TransactionId = newTransaction.id;
        result.ProductId = e;
        result.createdAt = new Date();
        result.updatedAt = new Date();
        return result;
      });

      let newTP = await TransactionProduct.bulkCreate(TPArrays, {
        transaction: t,
        returning: true,
      });

      if (!newTP.length) {
        throw { name: "fail TP bulkCreate" };
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
        attributes: { exclude: ["updatedAt"] },
        where: {
          CustomerId,
        },
        include: [
          {
            model: Customer,
            attributes: ["name"],
          },
          {
            model: Product,
          },
        ],
      });

      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }

  static async getTransactionById(req, res, next) {
    try {
      const { transactionId } = req.params;
      // console.log(req.params, "kontol2");
      const transaction = await Transaction.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          id: transactionId,
        },
        include: {
          model: Product,
          attributes: { exclude: ["createdAt", "updatedAt"] },
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
            success_redirect_url: "http://localhost:3000/myhistory",
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
        console.log(`MASUK ELSE`);
        res.status(200).json({ transaction, data: null });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getStaffTransactionById(req, res, next) {
    try {
      const { transactionId } = req.params;
      const transaction = await Transaction.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: {
          id: transactionId,
        },
        include: {
          model: Product,
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

  static async completeTransaction(req, res, next) {
    const t = await sequelize.transaction();
    try {
      console.log(`COMPLETE TRANS`);
      const { transactionId } = req.params;

      const transaction = await Transaction.findByPk(transactionId);

      if (!transaction) {
        throw { name: "transactionNotFound" };
      }
      const userToEmail = await Customer.findByPk(transaction.CustomerId)
      let newTransaction = await Transaction.update(
        { status: "done" },
        {
          where: {
            id: transactionId,
          },
          returning: true,
          transaction: t,
        }
      );
      let mailOptions = {
          // html: 'Embedded image: <img src="cid:xendit"/>',
          attachments: [
            {
              filename: "logo.png",
              path: "./views/logo.png",
              cid: "logo", //same cid value as in the html img src
            },
          ],
          from: "testinghaloprof@gmail.com",
          to: `${userToEmail.email}`,
          subject: "Laundry Fazz",
          text: `Laundry Fazz done`,
          template: "done",
          context: {
            TransactionId:`${transactionId}`,
            status:`Done`
            // image: ''
          },
        };
  
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err, "vvvv");
            throw { name: "nodemailer error" };
          } else {
            // console.log("Email Sent:" + info.response);
          }
        });
      await t.commit();
      res.status(200).json(newTransaction[1][0]);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
}

module.exports = Controller;
