const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DiaryEntry = sequelize.define('DiaryEntry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  portfolioValue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  emotion: {
    type: DataTypes.ENUM('happy', 'neutral', 'sad'),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  marketSnapshot: {
    type: DataTypes.JSON,
    allowNull: true
  },
  selectedETFs: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of ETF symbols and their data that user is tracking'
  },
  selectedNews: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of news IDs and titles that user found relevant'
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'date']
    }
  ]
});

module.exports = DiaryEntry;