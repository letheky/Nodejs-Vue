'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Research extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Research.belongsTo(models.Instructor, { foreignKey: 'leaderID', as: 'Leader' });
      Research.belongsTo(models.Circular, { foreignKey: 'auditCircularID', as: 'auditCircular' });
      Research.belongsTo(models.Circular, { foreignKey: 'allocationCircularID',as: 'allocationCircular' });
      Research.belongsTo(models.Circular, { foreignKey: 'councilCircularID', as: 'councilCircular', });
    }
  };
  Research.init({
    researchID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    researchTitle: DataTypes.STRING,
    researchLevel: DataTypes.STRING,
    description: DataTypes.TEXT,
    usage: DataTypes.STRING,
    duration: DataTypes.STRING,
    leaderID: DataTypes.INTEGER,
    members: DataTypes.TEXT,
    progress: DataTypes.STRING,
    evaluationDate: DataTypes.DATE,
    evaluationResult: DataTypes.STRING,
    budget: DataTypes.INTEGER,
    allocationCircularID: DataTypes.INTEGER,
    councilCircularID: DataTypes.INTEGER,
    auditCircularID: DataTypes.INTEGER,
    councilMembers: DataTypes.TEXT
    
  }, {
    sequelize,
    modelName: 'Research',
  });
  return Research;
};