const { Staff } = require("../models");
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
      const { email, password } = req.body;
      let newStaff = await Staff.create(
        {
          email,
          password,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json(newStaff);
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) throw { name: "staffLogin noInput" };

      let staff = await Staff.findOne({
        where: {
          email: email,
        },
      });

      if (!staff) {
        throw {
          name: "staffLogin Failed",
        };
      }

      const comparePassword = compare(password, staff.password);

      if (!comparePassword) {
        throw {
          name: "staffLogin Failed",
        };
      }

      const payload = {
        StaffId: staff.id,
        email: staff.email,
      };

      const token = signToken(payload);

      res.status(200).json({ access_token: token });
    } catch (error) {
      next(error);
    }
  }

  static async profile(req, res, next) {
    try {
      const { staffId } = req.params;
      const staff = await Staff.findOne({
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        where: {
          id: staffId,
        },
      });
      if (!staff) {
        throw {
          name: "staffNotFound",
        };
      }
      res.status(200).json(staff);
    } catch (error) {
      next(error);
    }
  }

  static async patchStaff(req, res, next) {
    try {
      const { StaffId } = req.staff;
      const { longitude, latitude } = req.body;
      const staff = await Staff.update(
        { longitude, latitude },
        {
          where: {
            id: StaffId,
          },
          returning: true,
        }
      );
      const objStaff = staff[1][0];
      delete objStaff.password
      res.status(200).json(objStaff);
    } catch (error) {
      next(error);
    }
  }

  // static async deleteStore(req, res, next) {
  //   const t = await sequelize.transaction();
  //   try {
  //     const { StaffId } = req.staff;
  //     const staff = await Staff.destroy({
  //       where: {
  //         id: StaffId,
  //       },
  //       transaction: t,
  //     });

  //     await t.commit();
  //     res.status(200).json({ message: `Staff Deleted` });
  //   } catch (error) {
  //     await t.rollback();
  //     next(error);
  //   }
  // }
}

module.exports = Controller;
