"use strict";
const { hash } = require("../helpers/bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Staff.hasMany(models.Transaction);
    }
  }
  Staff.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: { msg: "Staff email must be unique" },
        allowNull: false,
        validate: {
          notNull: { msg: "Staff email cannot be null" },
          notEmpty: { msg: "Staff email cannot be empty" },
          isEmail: { msg: "Staff email must be email format" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Staff password cannot be null" },
          notEmpty: { msg: "Staff password cannot be empty" },
          len: {
            args: [5],
            msg: "Staff password length minimum 5 letters",
          },
        },
      },
      longitude: DataTypes.STRING,
      latitude: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (staff) => {
          staff.password = hash(staff.password);
        },
      },
      sequelize,
      modelName: "Staff",
    }
  );
  return Staff;
};
