"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Topics", {
      topicID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      topicName: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.STRING,
      },
      leaderID: {
        type: Sequelize.INTEGER,
      },
      instructorID: {
        type: Sequelize.INTEGER,
      },
      members: {
        type: Sequelize.TEXT,
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
      allocationCircularID: {
        type: Sequelize.INTEGER,
      },
      councilCircularID: {
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
    await queryInterface.dropTable("Topics");
  },
};
