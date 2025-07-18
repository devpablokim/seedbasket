const { firestore } = require('./backend/config/firebase-admin');

const sampleCommodities = [
  { symbol: 'GLD', name: 'SPDR Gold Shares', type: 'commodity', latestPrice: 245.82, change: 1.23, changePercent: 0.50, category: 'Precious Metals' },
  { symbol: 'SLV', name: 'iShares Silver Trust', type: 'commodity', latestPrice: 29.45, change: 0.15, changePercent: 0.51, category: 'Precious Metals' },
  { symbol: 'USO', name: 'United States Oil Fund', type: 'commodity', latestPrice: 78.34, change: -0.45, changePercent: -0.57, category: 'Energy' },
  { symbol: 'UNG', name: 'United States Natural Gas Fund', type: 'commodity', latestPrice: 5.23, change: 0.08, changePercent: 1.55, category: 'Energy' },
  { symbol: 'DBA', name: 'Invesco DB Agriculture Fund', type: 'commodity', latestPrice: 22.67, change: 0.12, changePercent: 0.53, category: 'Agriculture' },
  { symbol: 'CORN', name: 'Teucrium Corn Fund', type: 'commodity', latestPrice: 24.12, change: -0.08, changePercent: -0.33, category: 'Agriculture' },
  { symbol: 'WEAT', name: 'Teucrium Wheat Fund', type: 'commodity', latestPrice: 5.89, change: 0.04, changePercent: 0.68, category: 'Agriculture' },
  { symbol: 'CPER', name: 'United States Copper Index Fund', type: 'commodity', latestPrice: 28.76, change: 0.22, changePercent: 0.77, category: 'Base Metals' }
];

const sampleETFs = [
  { symbol: 'VYM', name: 'Vanguard High Dividend Yield ETF', type: 'etf', latestPrice: 127.45, change: 0.89, changePercent: 0.70, category: 'Dividend' },
  { symbol: 'SCHD', name: 'Schwab US Dividend Equity ETF', type: 'etf', latestPrice: 88.23, change: 0.55, changePercent: 0.63, category: 'Dividend' },
  { symbol: 'DVY', name: 'iShares Select Dividend ETF', type: 'etf', latestPrice: 134.67, change: 0.78, changePercent: 0.58, category: 'Dividend' },
  { symbol: 'VIG', name: 'Vanguard Dividend Appreciation ETF', type: 'etf', latestPrice: 185.34, change: 1.12, changePercent: 0.61, category: 'Dividend' },
  { symbol: 'HDV', name: 'iShares Core High Dividend ETF', type: 'etf', latestPrice: 116.89, change: 0.66, changePercent: 0.57, category: 'Dividend' }
];

async function addSampleData() {
  console.log('Adding sample market data...');
  
  const batch = firestore.batch();
  const timestamp = new Date();
  
  // Add commodities
  for (const commodity of sampleCommodities) {
    const docRef = firestore.collection('marketData').doc(commodity.symbol);
    batch.set(docRef, {
      ...commodity,
      lastUpdated: timestamp,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      high: commodity.latestPrice + Math.abs(commodity.change),
      low: commodity.latestPrice - Math.abs(commodity.change),
      open: commodity.latestPrice - commodity.change,
      previousClose: commodity.latestPrice - commodity.change
    }, { merge: true });
  }
  
  // Add missing ETFs
  for (const etf of sampleETFs) {
    const docRef = firestore.collection('marketData').doc(etf.symbol);
    batch.set(docRef, {
      ...etf,
      lastUpdated: timestamp,
      volume: Math.floor(Math.random() * 5000000) + 500000,
      high: etf.latestPrice + Math.abs(etf.change),
      low: etf.latestPrice - Math.abs(etf.change),
      open: etf.latestPrice - etf.change,
      previousClose: etf.latestPrice - etf.change
    }, { merge: true });
  }
  
  await batch.commit();
  console.log('✅ Sample market data added successfully');
  process.exit(0);
}

addSampleData().catch(console.error);