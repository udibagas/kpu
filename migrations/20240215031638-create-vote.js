"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Votes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      CandidateId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Candidates",
          key: "uniqueId",
        },
      },
      RegionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Regions",
        },
      },
      vote: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("Votes");
  },
};
