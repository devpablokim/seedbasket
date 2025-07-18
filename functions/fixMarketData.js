const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Admin SDK is automatically initialized in Cloud Functions
const db = admin.firestore();

exports.fixMarketDataQueries = functions.https.onRequest(async (req, res) => {
  console.log('Testing market data queries...');
  
  try {
    // Test 1: Get all market data without filtering
    console.log('\n1. Testing getAllMarketData...');
    const allDataSnapshot = await db.collection('marketData').get();
    const allData = allDataSnapshot.docs.map(doc => ({ 
      symbol: doc.id, 
      ...doc.data() 
    }));
    console.log(`Found ${allData.length} total market data entries`);
    
    // Test 2: Get ETFs without orderBy (to avoid index requirement)
    console.log('\n2. Testing getETFs without orderBy...');
    const etfSnapshot = await db.collection('marketData')
      .where('type', '==', 'ETF')
      .get();
    const etfs = etfSnapshot.docs.map(doc => ({ 
      symbol: doc.id, 
      ...doc.data() 
    }));
    // Sort in memory instead
    etfs.sort((a, b) => a.symbol.localeCompare(b.symbol));
    console.log(`Found ${etfs.length} ETFs`);
    
    // Test 3: Get Commodities without orderBy
    console.log('\n3. Testing getCommodities without orderBy...');
    const commoditySnapshot = await db.collection('marketData')
      .where('type', '==', 'COMMODITY')
      .get();
    const commodities = commoditySnapshot.docs.map(doc => ({ 
      symbol: doc.id, 
      ...doc.data() 
    }));
    // Sort in memory instead
    commodities.sort((a, b) => a.symbol.localeCompare(b.symbol));
    console.log(`Found ${commodities.length} commodities`);
    
    // Test 4: Show sample data
    console.log('\n4. Sample data:');
    if (etfs.length > 0) {
      console.log('Sample ETF:', JSON.stringify(etfs[0], null, 2));
    }
    if (commodities.length > 0) {
      console.log('Sample Commodity:', JSON.stringify(commodities[0], null, 2));
    }
    
    res.json({
      success: true,
      summary: {
        totalCount: allData.length,
        etfCount: etfs.length,
        commodityCount: commodities.length
      },
      sampleData: {
        etf: etfs[0] || null,
        commodity: commodities[0] || null
      },
      message: 'Market data queries tested successfully. No composite index required when sorting in memory.'
    });
    
  } catch (error) {
    console.error('Error testing market data:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      suggestion: 'If seeing index errors, create composite index or remove orderBy from query'
    });
  }
});