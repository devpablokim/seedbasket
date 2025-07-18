const admin = require('firebase-admin');

// Initialize admin SDK with explicit project ID
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'seedbasket-342ca'
  });
}

const db = admin.firestore();

async function initializeCollections() {
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
      etfCount: 0,
      commodityCount: 0
    });
    console.log('✅ 시장 데이터 컬렉션 초기화');
    
    // 3. 뉴스 메타데이터
    const newsRef = db.collection('news').doc('_metadata');
    await newsRef.set({
      lastUpdate: admin.firestore.FieldValue.serverTimestamp(),
      totalCount: 0,
      categories: ['general', 'forex', 'crypto', 'merger']
    });
    console.log('✅ 뉴스 컬렉션 초기화');
    
    // 4. 샘플 ETF 데이터 추가
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
    
    for (const etf of sampleETFs) {
      await db.collection('marketData').doc(etf.symbol).set({
        ...etf,
        price: Math.random() * 300 + 50,
        previousClose: Math.random() * 300 + 50,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        high: Math.random() * 300 + 50,
        low: Math.random() * 300 + 50,
        open: Math.random() * 300 + 50,
        volume: Math.floor(Math.random() * 100000000),
        marketCap: Math.floor(Math.random() * 1000000000000),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log('✅ 샘플 ETF 데이터 추가');
    
    // 5. 샘플 원자재 데이터
    const sampleCommodities = [
      { symbol: 'USO', name: 'United States Oil Fund', type: 'COMMODITY' },
      { symbol: 'UNG', name: 'United States Natural Gas Fund', type: 'COMMODITY' },
      { symbol: 'DBA', name: 'Invesco DB Agriculture Fund', type: 'COMMODITY' },
      { symbol: 'DBB', name: 'Invesco DB Base Metals Fund', type: 'COMMODITY' },
      { symbol: 'DBC', name: 'Invesco DB Commodity Index Tracking Fund', type: 'COMMODITY' }
    ];
    
    for (const commodity of sampleCommodities) {
      await db.collection('marketData').doc(commodity.symbol).set({
        ...commodity,
        price: Math.random() * 100 + 20,
        previousClose: Math.random() * 100 + 20,
        change: (Math.random() - 0.5) * 5,
        changePercent: (Math.random() - 0.5) * 3,
        high: Math.random() * 100 + 20,
        low: Math.random() * 100 + 20,
        open: Math.random() * 100 + 20,
        volume: Math.floor(Math.random() * 50000000),
        marketCap: Math.floor(Math.random() * 500000000000),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log('✅ 샘플 원자재 데이터 추가');
    
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
    
    for (const news of sampleNews) {
      await db.collection('news').add({
        ...news,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log('✅ 샘플 뉴스 데이터 추가');
    
    console.log('\n🎉 Firestore 초기화 완료!');
    console.log('📊 Firebase Console에서 확인: https://console.firebase.google.com/project/seedbasket-342ca/firestore');
    
  } catch (error) {
    console.error('❌ Firestore 초기화 중 오류:', error);
  }
}

// 실행
initializeCollections();