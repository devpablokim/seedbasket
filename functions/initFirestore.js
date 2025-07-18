const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Admin SDK is automatically initialized in Cloud Functions
const db = admin.firestore();

exports.initializeFirestore = functions.https.onRequest(async (req, res) => {
  console.log('🚀 Firestore 초기화 시작...');
  
  try {
    // 1. 시스템 설정 컬렉션
    const systemRef = db.collection('system').doc('config');
    await systemRef.set({
      version: '1.0.0',
      initialized: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ 시스템 설정 완료');
    
    // 2. 초기 시장 데이터 구조
    const marketDataRef = db.collection('marketData').doc('_metadata');
    await marketDataRef.set({
      lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
      etfCount: 20,
      commodityCount: 5
    });
    console.log('✅ 시장 데이터 컬렉션 초기화');
    
    // 3. 뉴스 메타데이터
    const newsRef = db.collection('news').doc('_metadata');
    await newsRef.set({
      lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
      totalCount: 3,
      categories: ['macro', 'micro', 'market', 'commodity']
    });
    console.log('✅ 뉴스 컬렉션 초기화');
    
    // 4. Import complete ETF list from marketDataService
    const { ETF_SYMBOLS, COMMODITY_SYMBOLS } = require('./services/marketDataService');
    const { ETF_NAMES } = require('./data/symbols');
    
    // Process ETFs
    const batch = db.batch();
    let etfCount = 0;
    for (const symbol of ETF_SYMBOLS) {
      const docRef = db.collection('marketData').doc(symbol);
      const price = Math.random() * 300 + 50;
      const change = (Math.random() - 0.5) * 10;
      const changePercent = (change / price) * 100;
      
      batch.set(docRef, {
        symbol: symbol,
        name: ETF_NAMES[symbol] || symbol,
        type: 'ETF',
        price: parseFloat(price.toFixed(2)),
        previousClose: parseFloat((price - change).toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        high: parseFloat((price + Math.random() * 5).toFixed(2)),
        low: parseFloat((price - Math.random() * 5).toFixed(2)),
        open: parseFloat((price - change + (Math.random() - 0.5) * 2).toFixed(2)),
        volume: Math.floor(Math.random() * 100000000),
        marketCap: Math.floor(Math.random() * 1000000000000),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      etfCount++;
    }
    await batch.commit();
    console.log(`✅ ${etfCount} ETF 데이터 추가 완료`);
    
    // 5. Process Commodities
    const batch2 = db.batch();
    let commodityCount = 0;
    for (const commodity of COMMODITY_SYMBOLS) {
      const docRef = db.collection('marketData').doc(commodity.symbol);
      const price = Math.random() * 100 + 20;
      const change = (Math.random() - 0.5) * 5;
      const changePercent = (change / price) * 100;
      
      batch2.set(docRef, {
        symbol: commodity.symbol,
        name: commodity.name,
        type: 'COMMODITY',
        price: parseFloat(price.toFixed(2)),
        previousClose: parseFloat((price - change).toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        high: parseFloat((price + Math.random() * 3).toFixed(2)),
        low: parseFloat((price - Math.random() * 3).toFixed(2)),
        open: parseFloat((price - change + (Math.random() - 0.5) * 1).toFixed(2)),
        volume: Math.floor(Math.random() * 50000000),
        marketCap: Math.floor(Math.random() * 500000000000),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      commodityCount++;
    }
    await batch2.commit();
    console.log(`✅ ${commodityCount} 원자재 데이터 추가 완료`);
    
    // 6. 샘플 뉴스 데이터 추가
    const sampleNews = [
      {
        title: "Federal Reserve Maintains Interest Rates, Signals Future Cuts",
        summary: "The Federal Reserve kept interest rates unchanged but hinted at potential rate cuts in the coming months as inflation shows signs of cooling.",
        source: "Reuters",
        url: "https://example.com/fed-rates-" + Date.now() + "-1",
        publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)),
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
        url: "https://example.com/oil-surge-" + Date.now() + "-2",
        publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000)),
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
        url: "https://example.com/tech-earnings-" + Date.now() + "-3",
        publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 6 * 60 * 60 * 1000)),
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
    
    const batch3 = db.batch();
    for (const news of sampleNews) {
      const docRef = db.collection('news').doc();
      batch3.set(docRef, {
        ...news,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    await batch3.commit();
    console.log('✅ 샘플 뉴스 데이터 추가');
    
    res.json({
      success: true,
      message: 'Firestore initialized successfully!',
      collections: {
        marketData: {
          etfs: etfCount,
          commodities: commodityCount
        },
        news: sampleNews.length
      }
    });
    
  } catch (error) {
    console.error('❌ Firestore 초기화 중 오류:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});