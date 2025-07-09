"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addConstraint(
        "phones",
        {
          fields: ["imei"],
          type: "unique",
          name: "unique_imei_constraint",
        },
        { transaction: t }
      );
      await queryInterface.changeColumn(
        "phones", "name",
        {
          type: Sequelize.STRING,
          allowNull: false,
        },
        { transaction: t })
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeConstraint(
        "phones",
        "unique_imei_constraint",
        { transaction: t }
      );
      await queryInterface.changeColumn(
        "phones", "name",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t }
      );
    });
  },
};
