"use strict";
const { hash } = require("../helpers/bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.hasMany(models.Transaction);
    }
  }
  Customer.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: { msg: "Customer email must be unique" },
        allowNull: false,
        validate: {
          notNull: { msg: "Customer email cannot be null" },
          notEmpty: { msg: "Customer email cannot be empty" },
          isEmail: { msg: "Customer email must be email format" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Customer password cannot be null" },
          notEmpty: { msg: "Customer password cannot be empty" },
          len: {
            args: [5],
            msg: "Customer password length minimum 5 letters",
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Customer name cannot be null" },
          notEmpty: { msg: "Customer name cannot be empty" },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Customer phone number cannot be null" },
          notEmpty: { msg: "Customer phone number cannot be empty" },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (customer) => {
          customer.password = hash(customer.password);
        },
      },
      sequelize,
      modelName: "Customer",
    }
  );
  return Customer;
};
