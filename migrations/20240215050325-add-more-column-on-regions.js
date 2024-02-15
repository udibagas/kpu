"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Regions", "suara_total", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("Regions", "suara_sah", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("Regions", "suara_tidak_sah", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("Regions", "status_suara", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("Regions", "status_adm", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Regions", "suara_total");
    await queryInterface.removeColumn("Regions", "suara_sah");
    await queryInterface.removeColumn("Regions", "suara_tidak_sah");
    await queryInterface.removeColumn("Regions", "status_suara");
    await queryInterface.removeColumn("Regions", "status_adm");
  },
};
