"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Research", {
      researchID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      researchTitle: {
        type: Sequelize.STRING,
      },
      researchLevel: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      usage: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.STRING,
      },
      progress: {
        type: Sequelize.STRING,
      },
      evaluationDate: {
        type: Sequelize.DATE,
      },
      evaluationResult: {
        type: Sequelize.STRING,
      },
      budget: {
        type: Sequelize.INTEGER,
      },
      leaderID: {
        type: Sequelize.INTEGER,
      },
      members: {
        type: Sequelize.TEXT,
      },
      allocationCircularID: {
        type: Sequelize.INTEGER,
      },
      councilCircularID: {
        type: Sequelize.INTEGER,
      },
      auditCircularID: {
        type: Sequelize.INTEGER,
      },
      councilMembers: {
        type: Sequelize.TEXT,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Research");
  },
};
