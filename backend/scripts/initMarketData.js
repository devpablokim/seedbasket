const { firestore } = require('../config/firebase-admin');

// Sample ETF data
const sampleETFs = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'etf', category: 'Large Cap', latestPrice: 450.25, change: 2.15, changePercent: 0.48, volume: 75000000 },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'etf', category: 'Technology', latestPrice: 385.50, change: -1.25, changePercent: -0.32, volume: 45000000 },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', type: 'etf', category: 'Small Cap', latestPrice: 225.30, change: 0.85, changePercent: 0.38, volume: 30000000 },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', type: 'etf', category: 'Large Cap', latestPrice: 380.75, change: 1.50, changePercent: 0.40, volume: 4000000 },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'etf', category: 'Total Market', latestPrice: 240.80, change: 0.95, changePercent: 0.40, volume: 3500000 },
  { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'etf', category: 'Commodity', latestPrice: 185.25, change: -0.50, changePercent: -0.27, volume: 8000000 },
  { symbol: 'EEM', name: 'iShares MSCI Emerging Markets ETF', type: 'etf', category: 'Emerging Markets', latestPrice: 42.30, change: -0.15, changePercent: -0.35, volume: 35000000 },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund', type: 'etf', category: 'Financials', latestPrice: 38.90, change: 0.25, changePercent: 0.65, volume: 45000000 },
];

// Sample commodity data
const sampleCommodities = [
  { symbol: 'CL=F', name: 'Crude Oil', type: 'commodity', category: 'Energy', latestPrice: 73.25, change: 0.85, changePercent: 1.17, unit: 'per barrel' },
  { symbol: 'GC=F', name: 'Gold', type: 'commodity', category: 'Precious Metals', latestPrice: 2015.30, change: -5.20, changePercent: -0.26, unit: 'per oz' },
  { symbol: 'SI=F', name: 'Silver', type: 'commodity', category: 'Precious Metals', latestPrice: 23.45, change: 0.12, changePercent: 0.51, unit: 'per oz' },
  { symbol: 'NG=F', name: 'Natural Gas', type: 'commodity', category: 'Energy', latestPrice: 2.85, change: -0.03, changePercent: -1.04, unit: 'per MMBtu' },
  { symbol: 'ZC=F', name: 'Corn', type: 'commodity', category: 'Agriculture', latestPrice: 475.25, change: 2.50, changePercent: 0.53, unit: 'per bushel' },
];

async function initializeMarketData() {
  console.log('Initializing market data...');
  
  try {
    const batch = firestore.batch();
    
    // Add ETFs
    for (const etf of sampleETFs) {
      const docRef = firestore.collection('marketData').doc(etf.symbol);
      batch.set(docRef, {
        ...etf,
        lastUpdated: new Date(),
        marketCap: Math.floor(Math.random() * 500000000000) + 10000000000,
        week52High: etf.latestPrice * 1.15,
        week52Low: etf.latestPrice * 0.85,
        avgVolume: etf.volume,
        peRatio: Math.random() * 30 + 10,
        dividendYield: Math.random() * 3,
      });
    }
    
    // Add commodities
    for (const commodity of sampleCommodities) {
      const docRef = firestore.collection('marketData').doc(commodity.symbol);
      batch.set(docRef, {
        ...commodity,
        lastUpdated: new Date(),
        dayHigh: commodity.latestPrice * 1.02,
        dayLow: commodity.latestPrice * 0.98,
        week52High: commodity.latestPrice * 1.30,
        week52Low: commodity.latestPrice * 0.70,
      });
    }
    
    await batch.commit();
    console.log('Market data initialized successfully!');
    
  } catch (error) {
    console.error('Error initializing market data:', error);
  }
}

// Run the initialization
initializeMarketData();