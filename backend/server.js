const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const sequelize = require('./config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected successfully.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const authRoutes = require('./routes/auth');
const marketDataRoutes = require('./routes/marketData');
const diaryRoutes = require('./routes/diary');
const newsRoutes = require('./routes/news');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/market', marketDataRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const { updateMarketData } = require('./services/marketDataService');
const { fetchLatestNews } = require('./services/newsService');

// 매 30분마다 시장 데이터 업데이트 (Alpha Vantage + Finnhub 결합)
cron.schedule('*/30 * * * *', async () => {
  console.log('Running market data update...');
  await updateMarketData(); // Combined Alpha Vantage + Finnhub
});

// 매시간 뉴스 업데이트 (NewsAPI + Finnhub)
cron.schedule('0 * * * *', async () => {
  console.log('Running news update...');
  await fetchLatestNews(); // NewsAPI + Finnhub
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Note: WebSocket is disabled for free tier
  // Premium features can be enabled when upgraded
});