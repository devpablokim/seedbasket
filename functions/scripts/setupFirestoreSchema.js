/**
 * Firestore Schema Setup Script
 * This script sets up the Firestore collections to match the original MySQL database structure
 */

const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase Admin with service account or local emulator
if (!admin.apps.length) {
  // Check if we're in emulator mode
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    admin.initializeApp({
      projectId: 'seedbasket-342ca'
    });
  } else {
    // Use default initialization for production
    const serviceAccount = require('../serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'seedbasket-342ca'
    });
  }
}

const db = admin.firestore();

// Sample ETF data based on original MySQL schema
const sampleETFs = [
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF' },
  { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', type: 'ETF' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', type: 'ETF' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF' },
  { symbol: 'EEM', name: 'iShares MSCI Emerging Markets ETF', type: 'ETF' },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund', type: 'ETF' },
  { symbol: 'XLE', name: 'Energy Select Sector SPDR Fund', type: 'ETF' },
  { symbol: 'XLK', name: 'Technology Select Sector SPDR Fund', type: 'ETF' },
  { symbol: 'XLV', name: 'Health Care Select Sector SPDR Fund', type: 'ETF' },
  { symbol: 'GLD', name: 'SPDR Gold Trust', type: 'ETF' },
  { symbol: 'SLV', name: 'iShares Silver Trust', type: 'ETF' },
  { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', type: 'ETF' },
  { symbol: 'ARKK', name: 'ARK Innovation ETF', type: 'ETF' },
  { symbol: 'HYG', name: 'iShares iBoxx $ High Yield Corporate Bond ETF', type: 'ETF' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', type: 'ETF' },
  { symbol: 'SOXX', name: 'iShares Semiconductor ETF', type: 'ETF' },
  { symbol: 'XBI', name: 'SPDR S&P Biotech ETF', type: 'ETF' },
  { symbol: 'ICLN', name: 'iShares Global Clean Energy ETF', type: 'ETF' },
  { symbol: 'JETS', name: 'U.S. Global Jets ETF', type: 'ETF' }
];

// Sample Commodity data
const sampleCommodities = [
  { symbol: 'USO', name: 'United States Oil Fund', type: 'COMMODITY' },
  { symbol: 'UNG', name: 'United States Natural Gas Fund', type: 'COMMODITY' },
  { symbol: 'DBA', name: 'Invesco DB Agriculture Fund', type: 'COMMODITY' },
  { symbol: 'DBB', name: 'Invesco DB Base Metals Fund', type: 'COMMODITY' },
  { symbol: 'DBC', name: 'Invesco DB Commodity Index Tracking Fund', type: 'COMMODITY' }
];

// Helper function to generate random price data
function generatePriceData() {
  const basePrice = Math.random() * 300 + 50;
  const change = (Math.random() - 0.5) * 10;
  const changePercent = (change / basePrice) * 100;
  
  return {
    price: parseFloat(basePrice.toFixed(2)),
    previousClose: parseFloat((basePrice - change).toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    high: parseFloat((basePrice + Math.random() * 5).toFixed(2)),
    low: parseFloat((basePrice - Math.random() * 5).toFixed(2)),
    open: parseFloat((basePrice - change + (Math.random() - 0.5) * 2).toFixed(2)),
    volume: Math.floor(Math.random() * 100000000),
    marketCap: Math.floor(Math.random() * 1000000000000),
    lastUpdated: new Date()
  };
}

// Sample news data
const sampleNews = [
  {
    title: "Federal Reserve Maintains Interest Rates, Signals Future Cuts",
    summary: "The Federal Reserve kept interest rates unchanged but hinted at potential rate cuts in the coming months as inflation shows signs of cooling.",
    source: "Reuters",
    url: "https://example.com/fed-rates-" + Date.now(),
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    category: "macro",
    relevanceScores: {
      SPY: 0.9,
      QQQ: 0.8,
      TLT: 0.95,
      DIA: 0.85
    },
    aiSummary: "Fed maintains rates, dovish tone suggests cuts ahead. Positive for equities and bonds.",
    impactedETFs: ["SPY", "QQQ", "TLT", "DIA"],
    impactAnalysis: "Rate pause with dovish guidance typically benefits growth stocks and bonds."
  },
  {
    title: "Oil Prices Surge on Middle East Tensions",
    summary: "Crude oil futures jumped 3% as geopolitical tensions in the Middle East raise concerns about supply disruptions.",
    source: "Bloomberg",
    url: "https://example.com/oil-surge-" + Date.now(),
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    category: "commodity",
    relevanceScores: {
      USO: 0.95,
      XLE: 0.9,
      DBC: 0.85
    },
    aiSummary: "Oil spike on geopolitical risk. Energy sector likely to outperform.",
    impactedETFs: ["USO", "XLE", "DBC"],
    impactAnalysis: "Higher oil prices benefit energy ETFs but may pressure consumer discretionary."
  },
  {
    title: "Tech Earnings Beat Expectations Across the Board",
    summary: "Major technology companies reported better-than-expected earnings, driving optimism in the tech sector.",
    source: "CNBC",
    url: "https://example.com/tech-earnings-" + Date.now(),
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    category: "market",
    relevanceScores: {
      QQQ: 0.95,
      XLK: 0.9,
      SOXX: 0.85,
      ARKK: 0.8
    },
    aiSummary: "Strong tech earnings drive sector momentum. Growth stocks leading market higher.",
    impactedETFs: ["QQQ", "XLK", "SOXX", "ARKK"],
    impactAnalysis: "Earnings beats typically lead to sector rotation into technology."
  }
];

async function setupFirestoreSchema() {
  console.log('Setting up Firestore schema...');
  
  try {
    // 1. Setup MarketData collection (ETFs and Commodities)
    console.log('\n1. Setting up MarketData collection...');
    const marketDataBatch = db.batch();
    
    // Add ETFs
    for (const etf of sampleETFs) {
      const docRef = db.collection('marketData').doc(etf.symbol);
      const data = {
        ...etf,
        ...generatePriceData(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      marketDataBatch.set(docRef, data);
    }
    
    // Add Commodities
    for (const commodity of sampleCommodities) {
      const docRef = db.collection('marketData').doc(commodity.symbol);
      const data = {
        ...commodity,
        ...generatePriceData(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      marketDataBatch.set(docRef, data);
    }
    
    await marketDataBatch.commit();
    console.log(`✓ Added ${sampleETFs.length + sampleCommodities.length} market data entries`);
    
    // 2. Setup News collection
    console.log('\n2. Setting up News collection...');
    const newsBatch = db.batch();
    
    for (const newsItem of sampleNews) {
      const docRef = db.collection('news').doc();
      const data = {
        ...newsItem,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      newsBatch.set(docRef, data);
    }
    
    await newsBatch.commit();
    console.log(`✓ Added ${sampleNews.length} news entries`);
    
    // 3. Create collection indexes (metadata)
    console.log('\n3. Creating collection metadata...');
    
    // MarketData indexes metadata
    await db.collection('_metadata').doc('marketData_indexes').set({
      indexes: [
        'symbol',
        'type',
        'lastUpdated'
      ],
      description: 'Indexes for efficient querying of market data',
      createdAt: new Date()
    });
    
    // News indexes metadata
    await db.collection('_metadata').doc('news_indexes').set({
      indexes: [
        'publishedAt',
        'category',
        'url'
      ],
      description: 'Indexes for efficient querying of news',
      createdAt: new Date()
    });
    
    // 4. Create sample user (optional - for testing)
    console.log('\n4. Creating sample user...');
    const sampleUser = {
      email: 'demo@seedbasket.ai',
      name: 'Demo User',
      dailyReminder: true,
      reminderTime: '20:00',
      weeklyDigest: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('users').doc('demo-user').set(sampleUser);
    console.log('✓ Created sample user');
    
    // 5. Create collection structure documentation
    console.log('\n5. Documenting collection structure...');
    const collections = {
      users: {
        description: 'User accounts and preferences',
        fields: {
          email: 'string (unique)',
          password: 'string (hashed)',
          name: 'string',
          dailyReminder: 'boolean',
          reminderTime: 'string',
          weeklyDigest: 'boolean',
          firebaseUid: 'string (unique)',
          createdAt: 'timestamp',
          updatedAt: 'timestamp'
        }
      },
      marketData: {
        description: 'ETF and Commodity market data',
        documentId: 'symbol',
        fields: {
          symbol: 'string',
          name: 'string',
          type: 'string (ETF | COMMODITY)',
          price: 'number',
          previousClose: 'number',
          change: 'number',
          changePercent: 'number',
          high: 'number',
          low: 'number',
          open: 'number',
          volume: 'number',
          marketCap: 'number',
          lastUpdated: 'timestamp',
          createdAt: 'timestamp',
          updatedAt: 'timestamp'
        }
      },
      marketDataHistory: {
        description: 'Historical market data snapshots',
        fields: {
          symbol: 'string',
          name: 'string',
          type: 'string (ETF | COMMODITY)',
          price: 'number',
          previousClose: 'number',
          change: 'number',
          changePercent: 'number',
          volume: 'number',
          recordedAt: 'timestamp',
          createdAt: 'timestamp',
          updatedAt: 'timestamp'
        }
      },
      news: {
        description: 'Financial news and market updates',
        fields: {
          title: 'string',
          summary: 'string',
          source: 'string',
          url: 'string (unique)',
          publishedAt: 'timestamp',
          category: 'string (macro | micro | market | commodity)',
          relevanceScores: 'map<string, number>',
          aiSummary: 'string',
          impactedETFs: 'array<string>',
          impactAnalysis: 'string',
          createdAt: 'timestamp',
          updatedAt: 'timestamp'
        }
      },
      diaryEntries: {
        description: 'User investment diary entries',
        subcollection: 'users/{userId}/diaryEntries',
        fields: {
          date: 'string (YYYY-MM-DD)',
          portfolioValue: 'number',
          emotion: 'string (happy | neutral | sad)',
          notes: 'string',
          marketSnapshot: 'object',
          selectedETFs: 'array<string>',
          selectedNews: 'array<object>',
          createdAt: 'timestamp',
          updatedAt: 'timestamp'
        }
      },
      chatMessages: {
        description: 'AI chat conversation messages',
        subcollection: 'users/{userId}/conversations/{conversationId}/messages',
        fields: {
          role: 'string (user | assistant)',
          message: 'string',
          timestamp: 'timestamp',
          createdAt: 'timestamp',
          updatedAt: 'timestamp'
        }
      }
    };
    
    await db.collection('_metadata').doc('collections').set({
      collections,
      version: '1.0',
      migratedFrom: 'MySQL',
      createdAt: new Date()
    });
    
    console.log('\n✅ Firestore schema setup complete!');
    console.log('\nCollections created:');
    console.log('- marketData (ETFs and Commodities)');
    console.log('- news');
    console.log('- users');
    console.log('- _metadata (schema documentation)');
    console.log('\nSubcollections (created on demand):');
    console.log('- users/{userId}/diaryEntries');
    console.log('- users/{userId}/conversations/{conversationId}/messages');
    
  } catch (error) {
    console.error('Error setting up Firestore schema:', error);
    throw error;
  }
}

// Run the setup if called directly
if (require.main === module) {
  setupFirestoreSchema()
    .then(() => {
      console.log('\n🎉 Setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupFirestoreSchema };