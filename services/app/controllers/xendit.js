const { transporter } = require("../helpers/nodemailer");
const { Transaction, Customer } = require("../models");

class Controller {
  static async postXendit(req, res, next) {
    try {
      const { external_id } = req.body;
      const arrayId = external_id.split("_");
      const transactionById = await Transaction.findByPk(arrayId[0]);
      const customerById = await Customer.findByPk(arrayId[1]);
      if (!transactionById) {
        throw { name: "transactionNotFound" };
      }
      await transactionById.update({
        isPaid: true,
        status: "onProgress",
        pickupDate: new Date(),
        deliveryDate: new Date(new Date().valueOf() + 1000 * 3600 * 24),
      });

      let price = transactionById.totalPrice.toLocaleString("id")
      let mailOptions = {
        attachments: [
          {
            filename: "xendit.png",
            path: "./views/xendit.png",
            cid: "xendit", //same cid value as in the html img src
          },
          {
            filename: "logo.png",
            path: "./views/logo.png",
            cid: "logo", //same cid value as in the html img src
          },
        ],
        from: "testinghaloprof@gmail.com",
        to: `${customerById.email}`,
        subject: "Laundry Fazz",
        text: `Telah register di Laundry Fazz.`,
        template: "email",
        context: {
          nama: `${customerById.name}`,
          transactionId:`${arrayId[0]}`,
          price:`${price}`
        },
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          throw { name: "nodemailer error" };
        }
      });

      res.status(200).json({ msg: "Success payment" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
