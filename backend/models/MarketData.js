const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MarketData = sequelize.define('MarketData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  symbol: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('ETF', 'COMMODITY'),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  previousClose: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  change: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  changePercent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  volume: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  marketCap: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  indexes: [
    {
      unique: true,
      fields: ['symbol']
    },
    {
      fields: ['type']
    },
    {
      fields: ['lastUpdated']
    }
  ]
});

module.exports = MarketData;