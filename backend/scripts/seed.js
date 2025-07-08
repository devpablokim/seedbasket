const sequelize = require('../config/database');
const { MarketData } = require('../models');

const ETF_DATA = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF', price: 445.50, previousClose: 444.20, marketCap: 410000000000 },
  { symbol: 'IVV', name: 'iShares Core S&P 500 ETF', type: 'ETF', price: 447.80, previousClose: 446.50, marketCap: 340000000000 },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'ETF', price: 410.25, previousClose: 409.00, marketCap: 290000000000 },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF', price: 225.50, previousClose: 224.80, marketCap: 280000000000 },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', price: 375.20, previousClose: 373.50, marketCap: 190000000000 },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', type: 'ETF', price: 48.75, previousClose: 48.50, marketCap: 95000000000 },
  { symbol: 'VTV', name: 'Vanguard Value ETF', type: 'ETF', price: 150.20, previousClose: 149.80, marketCap: 90000000000 },
  { symbol: 'IEFA', name: 'iShares Core MSCI EAFE ETF', type: 'ETF', price: 72.30, previousClose: 72.00, marketCap: 88000000000 },
  { symbol: 'BND', name: 'Vanguard Total Bond Market ETF', type: 'ETF', price: 75.80, previousClose: 75.90, marketCap: 85000000000 },
  { symbol: 'VUG', name: 'Vanguard Growth ETF', type: 'ETF', price: 290.50, previousClose: 289.00, marketCap: 82000000000 },
  { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'COMMODITY', price: 185.75, previousClose: 184.50, marketCap: 60000000000 },
  { symbol: 'USO', name: 'United States Oil Fund', type: 'COMMODITY', price: 78.25, previousClose: 77.80, marketCap: 3000000000 }
];

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    for (const etf of ETF_DATA) {
      const change = etf.price - etf.previousClose;
      const changePercent = (change / etf.previousClose) * 100;
      
      await MarketData.create({
        ...etf,
        change,
        changePercent,
        volume: Math.floor(Math.random() * 50000000) + 10000000,
        lastUpdated: new Date()
      });
      
      console.log(`Created ${etf.symbol}`);
    }

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();