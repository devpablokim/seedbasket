const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { analyzeNewsImpact } = require('./services/aiService');

exports.testNewsAnalysis = functions.https.onRequest(async (req, res) => {
  try {
    const db = admin.firestore();
    
    // Get ETF list
    const etfsSnapshot = await db.collection('marketData')
      .where('type', '==', 'ETF')
      .limit(10)
      .get();
    
    const etfList = etfsSnapshot.docs.map(doc => ({
      symbol: doc.id,
      ...doc.data()
    }));
    
    // Test news item
    const testNews = {
      title: "Federal Reserve Signals Potential Rate Cuts in 2025",
      summary: "The Fed indicated it may lower interest rates next year as inflation continues to moderate."
    };
    
    console.log('Testing AI analysis with:', {
      newsTitle: testNews.title,
      etfCount: etfList.length
    });
    
    // Analyze impact
    const analysis = await analyzeNewsImpact(
      testNews.title,
      testNews.summary,
      etfList
    );
    
    res.json({
      success: true,
      testNews,
      etfCount: etfList.length,
      analysis,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Test analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});