const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const marketRoutes = require('./routes/market');
const newsRoutes = require('./routes/news');
const diaryRoutes = require('./routes/diary');
const aiRoutes = require('./routes/ai');

// API routes
app.use('/auth', authRoutes);
app.use('/market', marketRoutes);
app.use('/news', newsRoutes);
app.use('/diary', diaryRoutes);
app.use('/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);

// Scheduled functions for data updates
const { updateMarketData } = require('./services/marketDataService');
const { fetchLatestNews } = require('./services/newsService');

// Update market data every hour at the top of the hour
exports.scheduledMarketUpdate = functions.pubsub
  .schedule('0 * * * *')  // Run at minute 0 of every hour
  .timeZone('America/New_York')  // EST/EDT timezone for market hours
  .onRun(async (context) => {
    console.log('Running scheduled market data update at', new Date());
    try {
      await updateMarketData();
      console.log('Market data update completed successfully');
    } catch (error) {
      console.error('Market data update failed:', error);
    }
    return null;
  });

// Update news every hour at the top of the hour
exports.scheduledNewsUpdate = functions.pubsub
  .schedule('0 * * * *')  // Run at minute 0 of every hour
  .timeZone('America/New_York')
  .onRun(async (context) => {
    console.log('Running scheduled news update at', new Date());
    try {
      await fetchLatestNews();
      console.log('News update completed successfully');
    } catch (error) {
      console.error('News update failed:', error);
    }
    return null;
  });

// Import initialization function
exports.initializeFirestore = require('./initFirestore').initializeFirestore;

// Import test function
exports.testApiKeys = require('./testApiKeys').testApiKeys;

// Import manual update function
exports.manualMarketUpdate = require('./manualUpdate').manualMarketUpdate;

// Import fix market data function
exports.fixMarketDataQueries = require('./fixMarketData').fixMarketDataQueries;

// Import update news function
exports.updateNewsData = require('./updateNews').updateNewsData;

// Import trigger news update function
exports.triggerNewsUpdate = require('./triggerNewsUpdate').triggerNewsUpdate;

// Import test news analysis function
exports.testNewsAnalysis = require('./testNewsAnalysis').testNewsAnalysis;

// Import trigger news analysis function
exports.triggerNewsAnalysis = require('./triggerNewsAnalysis').triggerNewsAnalysis;