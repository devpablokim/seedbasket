const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const News = sequelize.define('News', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('macro', 'micro', 'market', 'commodity'),
    allowNull: false
  },
  relevanceScores: {
    type: DataTypes.JSON,
    allowNull: true
  },
  aiSummary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  impactedETFs: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'AI-analyzed ETFs that might be impacted by this news'
  },
  impactAnalysis: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'AI analysis of how this news impacts specific ETFs'
  }
}, {
  indexes: [
    {
      fields: ['publishedAt']
    },
    {
      fields: ['category']
    }
  ]
});

module.exports = News;