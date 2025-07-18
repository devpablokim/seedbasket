const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');
const firestore = admin.firestore();

// Collections
const COLLECTIONS = {
  USERS: 'users',
  MARKET_DATA: 'marketData',
  NEWS: 'news',
  DIARY_ENTRIES: 'diaryEntries',
  CHAT_MESSAGES: 'chatMessages',
  ETF_LIST: 'etfList',
  COMMODITY_LIST: 'commodityList',
  CACHE: 'cache',
  MARKET_HISTORY: 'marketHistory'
};

// User operations
async function createUser(uid, userData) {
  await firestore.collection(COLLECTIONS.USERS).doc(uid).set({
    ...userData,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
}

async function getUser(uid) {
  const doc = await firestore.collection(COLLECTIONS.USERS).doc(uid).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function updateUser(uid, updates) {
  await firestore.collection(COLLECTIONS.USERS).doc(uid).update({
    ...updates,
    updatedAt: FieldValue.serverTimestamp()
  });
}

// Market Data operations
async function saveMarketData(symbol, data) {
  await firestore.collection(COLLECTIONS.MARKET_DATA).doc(symbol).set({
    ...data,
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
}

async function getMarketData(symbol) {
  const doc = await firestore.collection(COLLECTIONS.MARKET_DATA).doc(symbol).get();
  return doc.exists ? { symbol: doc.id, ...doc.data() } : null;
}

async function getAllMarketData() {
  const snapshot = await firestore.collection(COLLECTIONS.MARKET_DATA).get();
  return snapshot.docs.map(doc => ({ symbol: doc.id, ...doc.data() }));
}

async function getETFs() {
  const snapshot = await firestore.collection(COLLECTIONS.MARKET_DATA)
    .where('type', '==', 'ETF')
    .get();
  const data = snapshot.docs.map(doc => ({ symbol: doc.id, ...doc.data() }));
  // Sort in memory to avoid composite index requirement
  return data.sort((a, b) => a.symbol.localeCompare(b.symbol));
}

async function getCommodities() {
  const snapshot = await firestore.collection(COLLECTIONS.MARKET_DATA)
    .where('type', '==', 'COMMODITY')
    .get();
  const data = snapshot.docs.map(doc => ({ symbol: doc.id, ...doc.data() }));
  // Sort in memory to avoid composite index requirement
  return data.sort((a, b) => a.symbol.localeCompare(b.symbol));
}

// News operations
async function saveNews(newsData) {
  const docRef = await firestore.collection(COLLECTIONS.NEWS).add({
    ...newsData,
    createdAt: FieldValue.serverTimestamp()
  });
  return docRef.id;
}

async function getNews(filters = {}) {
  let query = firestore.collection(COLLECTIONS.NEWS);
  
  if (filters.category) {
    query = query.where('category', '==', filters.category);
  }
  
  if (filters.startDate) {
    query = query.where('publishedAt', '>=', filters.startDate);
  }
  
  query = query.orderBy('publishedAt', 'desc');
  
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Diary operations
async function saveDiaryEntry(userId, entryData) {
  const docRef = await firestore
    .collection(COLLECTIONS.DIARY_ENTRIES)
    .doc(userId)
    .collection('entries')
    .add({
      ...entryData,
      userId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  return docRef.id;
}

async function getDiaryEntries(userId, filters = {}) {
  let query = firestore
    .collection(COLLECTIONS.DIARY_ENTRIES)
    .doc(userId)
    .collection('entries');
  
  if (filters.startDate) {
    query = query.where('date', '>=', filters.startDate);
  }
  
  if (filters.endDate) {
    query = query.where('date', '<=', filters.endDate);
  }
  
  query = query.orderBy('date', 'desc');
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function updateDiaryEntry(userId, entryId, updates) {
  await firestore
    .collection(COLLECTIONS.DIARY_ENTRIES)
    .doc(userId)
    .collection('entries')
    .doc(entryId)
    .update({
      ...updates,
      updatedAt: FieldValue.serverTimestamp()
    });
}

async function deleteDiaryEntry(userId, entryId) {
  await firestore
    .collection(COLLECTIONS.DIARY_ENTRIES)
    .doc(userId)
    .collection('entries')
    .doc(entryId)
    .delete();
}

// Chat operations
async function saveChatMessage(userId, conversationId, messageData) {
  const docRef = await firestore
    .collection(COLLECTIONS.CHAT_MESSAGES)
    .doc(userId)
    .collection('conversations')
    .doc(conversationId)
    .collection('messages')
    .add({
      ...messageData,
      timestamp: FieldValue.serverTimestamp()
    });
  
  // Update conversation metadata
  await firestore
    .collection(COLLECTIONS.CHAT_MESSAGES)
    .doc(userId)
    .collection('conversations')
    .doc(conversationId)
    .set({
      lastMessage: messageData.message,
      lastMessageTime: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  
  return docRef.id;
}

async function getChatMessages(userId, conversationId) {
  const snapshot = await firestore
    .collection(COLLECTIONS.CHAT_MESSAGES)
    .doc(userId)
    .collection('conversations')
    .doc(conversationId)
    .collection('messages')
    .orderBy('timestamp', 'asc')
    .get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getConversations(userId) {
  const snapshot = await firestore
    .collection(COLLECTIONS.CHAT_MESSAGES)
    .doc(userId)
    .collection('conversations')
    .orderBy('lastMessageTime', 'desc')
    .get();
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      // Map lastMessageTime to timestamp for frontend consistency
      timestamp: data.lastMessageTime,
      preview: data.lastMessage || 'New conversation'
    };
  });
}

async function deleteConversation(userId, conversationId) {
  // Delete all messages in the conversation
  const messages = await firestore
    .collection(COLLECTIONS.CHAT_MESSAGES)
    .doc(userId)
    .collection('conversations')
    .doc(conversationId)
    .collection('messages')
    .get();
  
  const batch = firestore.batch();
  messages.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  // Delete conversation metadata
  batch.delete(
    firestore
      .collection(COLLECTIONS.CHAT_MESSAGES)
      .doc(userId)
      .collection('conversations')
      .doc(conversationId)
  );
  
  await batch.commit();
}

// Batch operations for migration
async function batchSaveMarketData(dataArray) {
  const batch = firestore.batch();
  const timestamp = new Date();
  
  dataArray.forEach(data => {
    const docRef = firestore.collection(COLLECTIONS.MARKET_DATA).doc(data.symbol);
    batch.set(docRef, {
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  });
  
  await batch.commit();
  
  // Also save to market history for tracking
  await saveMarketHistory(dataArray, timestamp);
}

// Cache operations
async function getCachedData(cacheKey) {
  const doc = await firestore.collection(COLLECTIONS.CACHE).doc(cacheKey).get();
  if (!doc.exists) return null;
  
  const data = doc.data();
  const now = new Date();
  const cacheTime = data.timestamp?.toDate() || new Date(0);
  const hoursSinceCache = (now - cacheTime) / (1000 * 60 * 60);
  
  // Return null if cache is older than 1 hour
  if (hoursSinceCache > 1) return null;
  
  return data.data;
}

async function setCachedData(cacheKey, data) {
  await firestore.collection(COLLECTIONS.CACHE).doc(cacheKey).set({
    data,
    timestamp: FieldValue.serverTimestamp()
  });
}

// Market history for data accumulation
async function saveMarketHistory(marketData, timestamp) {
  const historyBatch = firestore.batch();
  const dateKey = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
  const hourKey = timestamp.getHours().toString().padStart(2, '0'); // HH
  
  marketData.forEach(data => {
    const docRef = firestore
      .collection(COLLECTIONS.MARKET_HISTORY)
      .doc(data.symbol)
      .collection(dateKey)
      .doc(hourKey);
    
    historyBatch.set(docRef, {
      ...data,
      timestamp: timestamp
    });
  });
  
  await historyBatch.commit();
}

module.exports = {
  // User operations
  createUser,
  getUser,
  updateUser,
  
  // Market data operations
  saveMarketData,
  getMarketData,
  getAllMarketData,
  getETFs,
  getCommodities,
  batchSaveMarketData,
  
  // Cache operations
  getCachedData,
  setCachedData,
  
  // History operations
  saveMarketHistory,
  
  // News operations
  saveNews,
  getNews,
  
  // Diary operations
  saveDiaryEntry,
  getDiaryEntries,
  updateDiaryEntry,
  deleteDiaryEntry,
  
  // Chat operations
  saveChatMessage,
  getChatMessages,
  getConversations,
  deleteConversation,
  
  // Collections
  COLLECTIONS
};