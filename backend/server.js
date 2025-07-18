const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Firebase routes
const firebaseAuthRoutes = require('./routes/firebaseAuth');
const firebaseMarketRoutes = require('./routes/firebaseMarket');
const firebaseDiaryRoutes = require('./routes/firebaseDiary');
const firebaseNewsRoutes = require('./routes/firebaseNews');
const firebaseAIRoutes = require('./routes/firebaseAI');
const firebaseNewsAnalysisRoutes = require('./routes/firebaseNewsAnalysis');
const firebaseNewsTranslationRoutes = require('./routes/firebaseNewsTranslation');

app.use('/api/auth', firebaseAuthRoutes);
app.use('/api/market', firebaseMarketRoutes);
app.use('/api/diary', firebaseDiaryRoutes);
app.use('/api/news', firebaseNewsRoutes);
app.use('/api/ai', firebaseAIRoutes);
app.use('/api/news-analysis', firebaseNewsAnalysisRoutes);
app.use('/api/news-translation', firebaseNewsTranslationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date(), database: 'Firebase' });
});

// Import Firebase versions of services
const { updateMarketData } = require('./services/marketDataServiceFirebase');
const { fetchLatestNews } = require('./services/newsServiceFirebase');

// Schedule market data updates every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  console.log('Running market data update...');
  await updateMarketData();
});

// Schedule news updates every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running news update...');
  await fetchLatestNews();
});

// Initial data fetch on startup
setTimeout(async () => {
  console.log('Running initial data fetch...');
  await updateMarketData();
  await fetchLatestNews();
}, 5000);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} with Firebase backend`);
});