const sequelize = require('../config/database');
const User = require('./User');
const DiaryEntry = require('./DiaryEntry');
const MarketData = require('./MarketData');
const MarketDataHistory = require('./MarketDataHistory');
const News = require('./News');
const ChatMessage = require('./ChatMessage');

User.hasMany(DiaryEntry, { foreignKey: 'userId' });
DiaryEntry.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ChatMessage, { foreignKey: 'userId' });
ChatMessage.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  DiaryEntry,
  MarketData,
  MarketDataHistory,
  News,
  ChatMessage
};