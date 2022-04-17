"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Customer);
      Transaction.belongsTo(models.Staff);
      Transaction.belongsToMany(models.Product, {
        foreignKey: "TransactionId",
        through: models.TransactionProduct,
      });
    }
  }
  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      CustomerId: DataTypes.INTEGER,
      StaffId: DataTypes.INTEGER,
      isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
      pickupDate: DataTypes.DATE,
      deliveryDate: DataTypes.DATE,
      longitude: DataTypes.STRING,
      latitude: DataTypes.STRING,
      totalPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
