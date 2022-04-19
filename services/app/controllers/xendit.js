const { transporter } = require("../helpers/nodemailer");
const { Transaction, Customer } = require("../models");

class Controller {
  static async postXendit(req, res, next) {
    try {
      //COMMENT YANG ADA DISINI JANGAN DI HAPUS
      const { external_id } = req.body;
      // console.log(req.body, `MASUK XENDIT CALLBACK`);
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

      console.log(customerById.email, `EMAIL`);
      let mailOptions = {
        // html: 'Embedded image: <img src="cid:xendit"/>',
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

      res.status(200).json({ msg: "Success payment" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
