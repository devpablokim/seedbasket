const sequelize = require('../config/database');
const { User, MarketData, News, DiaryEntry, ChatMessage } = require('../models');
const firebaseData = require('../services/firebaseDataService');
const { auth } = require('../config/firebase-admin');

async function migrateUsers() {
  console.log('Migrating users...');
  const users = await User.findAll();
  
  for (const user of users) {
    try {
      // Create Firebase Auth user if not exists
      let firebaseUser;
      try {
        firebaseUser = await auth.getUserByEmail(user.email);
      } catch (error) {
        // User doesn't exist in Firebase, create one
        firebaseUser = await auth.createUser({
          email: user.email,
          displayName: user.name,
          password: Math.random().toString(36).slice(-8) // Temporary password
        });
        console.log(`Created Firebase user for ${user.email}`);
      }
      
      // Save user data to Firestore
      await firebaseData.createUser(firebaseUser.uid, {
        name: user.name,
        email: user.email,
        dailyReminder: user.dailyReminder,
        reminderTime: user.reminderTime,
        weeklyDigest: user.weeklyDigest,
        mysqlId: user.id // Keep reference to old ID
      });
      
      console.log(`Migrated user: ${user.email}`);
    } catch (error) {
      console.error(`Failed to migrate user ${user.email}:`, error);
    }
  }
}

async function migrateMarketData() {
  console.log('Migrating market data...');
  const marketData = await MarketData.findAll();
  
  const dataArray = marketData.map(item => ({
    symbol: item.symbol,
    name: item.name,
    type: item.type,
    price: item.price,
    previousClose: item.previousClose,
    change: item.change,
    changePercent: item.changePercent,
    high: item.high,
    low: item.low,
    open: item.open,
    volume: item.volume,
    lastUpdated: item.updatedAt
  }));
  
  // Batch save for efficiency
  await firebaseData.batchSaveMarketData(dataArray);
  console.log(`Migrated ${dataArray.length} market data records`);
}

async function migrateNews() {
  console.log('Migrating news...');
  const news = await News.findAll();
  
  for (const article of news) {
    try {
      await firebaseData.saveNews({
        title: article.title,
        summary: article.summary,
        content: article.content,
        url: article.url,
        source: article.source,
        category: article.category,
        publishedAt: article.publishedAt,
        imageUrl: article.imageUrl,
        sentiment: article.sentiment,
        impactedETFs: article.impactedETFs,
        impactAnalysis: article.impactAnalysis
      });
    } catch (error) {
      console.error(`Failed to migrate news article:`, error);
    }
  }
  console.log(`Migrated ${news.length} news articles`);
}

async function migrateDiaryEntries() {
  console.log('Migrating diary entries...');
  const entries = await DiaryEntry.findAll({
    include: [User]
  });
  
  for (const entry of entries) {
    try {
      // Get Firebase UID for the user
      const firebaseUser = await auth.getUserByEmail(entry.User.email);
      
      await firebaseData.saveDiaryEntry(firebaseUser.uid, {
        date: entry.date,
        emotion: entry.emotion,
        notes: entry.notes,
        portfolioValue: entry.portfolioValue,
        tags: entry.tags,
        relatedETFs: entry.relatedETFs,
        relatedNews: entry.relatedNews,
        mysqlId: entry.id
      });
    } catch (error) {
      console.error(`Failed to migrate diary entry:`, error);
    }
  }
  console.log(`Migrated ${entries.length} diary entries`);
}

async function migrateChatMessages() {
  console.log('Migrating chat messages...');
  const messages = await ChatMessage.findAll({
    include: [User],
    order: [['timestamp', 'ASC']]
  });
  
  // Group messages by user and conversation
  const messagesByUserAndConversation = {};
  
  for (const message of messages) {
    const userEmail = message.User.email;
    const conversationId = message.conversationId;
    
    if (!messagesByUserAndConversation[userEmail]) {
      messagesByUserAndConversation[userEmail] = {};
    }
    
    if (!messagesByUserAndConversation[userEmail][conversationId]) {
      messagesByUserAndConversation[userEmail][conversationId] = [];
    }
    
    messagesByUserAndConversation[userEmail][conversationId].push(message);
  }
  
  // Migrate messages
  for (const [userEmail, conversations] of Object.entries(messagesByUserAndConversation)) {
    try {
      const firebaseUser = await auth.getUserByEmail(userEmail);
      
      for (const [conversationId, messages] of Object.entries(conversations)) {
        for (const message of messages) {
          await firebaseData.saveChatMessage(firebaseUser.uid, conversationId, {
            role: message.role,
            message: message.message,
            mysqlId: message.id
          });
        }
      }
    } catch (error) {
      console.error(`Failed to migrate chat messages for ${userEmail}:`, error);
    }
  }
  
  console.log(`Migrated ${messages.length} chat messages`);
}

async function runMigration() {
  try {
    console.log('Starting migration to Firebase...');
    
    await sequelize.authenticate();
    console.log('Connected to MySQL database');
    
    await migrateUsers();
    await migrateMarketData();
    await migrateNews();
    await migrateDiaryEntries();
    await migrateChatMessages();
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Run migration
runMigration();