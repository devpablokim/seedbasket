const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Admin SDK is automatically initialized in Cloud Functions
const db = admin.firestore();

exports.updateNewsData = functions.https.onRequest(async (req, res) => {
  console.log('Updating news data with proper timestamps...');
  
  try {
    // Sample news with proper Firebase timestamps
    const sampleNews = [
      {
        title: "Federal Reserve Maintains Interest Rates, Signals Future Cuts",
        summary: "The Federal Reserve kept interest rates unchanged but hinted at potential rate cuts in the coming months as inflation shows signs of cooling.",
        source: "Reuters",
        url: "https://example.com/fed-rates",
        publishedAt: admin.firestore.Timestamp.now(),
        category: "macro",
        relevanceScores: {
          SPY: 0.9,
          QQQ: 0.8,
          TLT: 0.95,
          DIA: 0.85
        },
        aiSummary: "Fed maintains rates, dovish tone suggests cuts ahead. Positive for equities and bonds.",
        impactedETFs: [
          { symbol: "SPY", impact: "positive", reason: "Rate stability supports stocks" },
          { symbol: "QQQ", impact: "positive", reason: "Tech benefits from low rates" },
          { symbol: "TLT", impact: "positive", reason: "Bonds rally on cut expectations" }
        ],
        impactAnalysis: "Rate pause with dovish guidance typically benefits growth stocks and bonds."
      },
      {
        title: "Oil Prices Surge on Middle East Tensions",
        summary: "Crude oil futures jumped 3% as geopolitical tensions in the Middle East raise concerns about supply disruptions.",
        source: "Bloomberg",
        url: "https://example.com/oil-surge",
        publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 2 * 60 * 60 * 1000)),
        category: "commodity",
        relevanceScores: {
          USO: 0.95,
          XLE: 0.9,
          DBC: 0.85
        },
        aiSummary: "Oil spike on geopolitical risk. Energy sector likely to outperform.",
        impactedETFs: [
          { symbol: "USO", impact: "positive", reason: "Direct oil exposure" },
          { symbol: "XLE", impact: "positive", reason: "Energy sector benefits" },
          { symbol: "DBC", impact: "positive", reason: "Commodity basket gains" }
        ],
        impactAnalysis: "Higher oil prices benefit energy ETFs but may pressure consumer discretionary."
      },
      {
        title: "Tech Earnings Beat Expectations Across the Board",
        summary: "Major technology companies reported better-than-expected earnings, driving optimism in the tech sector.",
        source: "CNBC",
        url: "https://example.com/tech-earnings",
        publishedAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() - 4 * 60 * 60 * 1000)),
        category: "market",
        relevanceScores: {
          QQQ: 0.95,
          XLK: 0.9,
          SOXX: 0.85,
          ARKK: 0.8
        },
        aiSummary: "Strong tech earnings drive sector momentum. Growth stocks leading market higher.",
        impactedETFs: [
          { symbol: "QQQ", impact: "positive", reason: "Tech-heavy index" },
          { symbol: "XLK", impact: "positive", reason: "Tech sector fund" },
          { symbol: "SOXX", impact: "positive", reason: "Semiconductor strength" }
        ],
        impactAnalysis: "Earnings beats typically lead to sector rotation into technology."
      }
    ];
    
    // Clear existing news
    const newsSnapshot = await db.collection('news').get();
    const batch = db.batch();
    newsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Deleted ${newsSnapshot.size} old news items`);
    
    // Add new news
    const batch2 = db.batch();
    for (const news of sampleNews) {
      const docRef = db.collection('news').doc();
      batch2.set(docRef, {
        ...news,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    await batch2.commit();
    
    res.json({
      success: true,
      message: `Updated ${sampleNews.length} news items with proper timestamps`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});