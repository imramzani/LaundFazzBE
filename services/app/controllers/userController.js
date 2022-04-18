const { Customer } = require("../models");
// const { transporter } = require("../helpers/nodemailer");
const { compare } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class UserController {
  static async register(req, res, next) {
    try {
      const { email, password, name, phoneNumber } = req.body;
      const data = await Customer.create({
        email,
        password,
        name,
        phoneNumber,
      });
      // let mailOptions = {
      //   from: "testinghaloprof@gmail.com",
      //   to: `${email}`,
      //   subject: "Laundry Fazz",
      //   text: `Telah register di Laundry Fazz.`,
      // };

      // transporter.sendMail(mailOptions, (err, info) => {
      //   if (err) {
      //     throw { name: "nodemailer error" };
      //   } else {
      //     console.log("Email Sent:" + info.response);
      //   }
      // });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw { name: "custLogin noInput" };
      }
      let emailSearch = await Customer.findOne({
        where: {
          email,
        },
      });
      
      if (!emailSearch) {
        throw { name: "custLogin Failed" };
      }
      let comaparePass = compare(password, emailSearch.password);

      if (!comaparePass) {
        throw { name: "custLogin Failed" };
      }
      let access_token = signToken({
        CustomerId: emailSearch.id,
        email: emailSearch.email
      });
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
  static async list(req, res, next) {
    try {
      const data = await Customer.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
