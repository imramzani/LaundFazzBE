"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      CustomerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Customers",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      StaffId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Staffs",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      isPaid: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "pending",
      },
      pickupDate: {
        type: Sequelize.DATE,
        // isDate: true
      },
      deliveryDate: {
        type: Sequelize.DATE,
        // isDate: true
      },
      longitude: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.STRING,
      },
      totalPrice: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Transactions");
  },
};
