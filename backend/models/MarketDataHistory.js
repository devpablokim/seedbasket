const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MarketDataHistory = sequelize.define('MarketDataHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
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
      allowNull: false
    },
    change: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    changePercent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    volume: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    recordedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    indexes: [
      {
        fields: ['symbol', 'recordedAt']
      },
      {
        fields: ['recordedAt']
      }
    ]
  });

module.exports = MarketDataHistory;