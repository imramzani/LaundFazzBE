"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransactionProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransactionProduct.belongsTo(models.Transaction, {
        foreignKey: "TransactionId",
      });
      TransactionProduct.belongsTo(models.Product, { foreignKey: "ProductId" });
    }
  }
  TransactionProduct.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      TransactionId: DataTypes.INTEGER,
      ProductId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TransactionProduct",
    }
  );
  return TransactionProduct;
};
