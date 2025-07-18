const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { analyzeNewsImpact } = require('./services/aiService');
const firebaseData = require('./services/firebaseDataService');

// Admin SDK is automatically initialized in Cloud Functions
const db = admin.firestore();

exports.triggerNewsAnalysis = functions.https.onRequest(async (req, res) => {
  console.log('Triggering news analysis for existing news...');
  
  try {
    // Get all news items that don't have AI analysis
    const newsSnapshot = await db.collection('news')
      .orderBy('publishedAt', 'desc')
      .limit(50)
      .get();
    
    // Get ETF list for analysis
    const etfList = await firebaseData.getETFs();
    
    let analyzedCount = 0;
    let skippedCount = 0;
    
    const batch = db.batch();
    
    for (const doc of newsSnapshot.docs) {
      const news = doc.data();
      
      // Skip if already has AI analysis
      if (news.impactedETFs && news.impactedETFs.length > 0) {
        skippedCount++;
        continue;
      }
      
      try {
        // Analyze news impact
        const impactAnalysis = await analyzeNewsImpact(
          news.title,
          news.summary || news.content || '',
          etfList
        );
        
        if (impactAnalysis && impactAnalysis.impactedETFs) {
          batch.update(doc.ref, {
            impactedETFs: impactAnalysis.impactedETFs,
            impactAnalysis: impactAnalysis.summary,
            sentiment: impactAnalysis.impactedETFs[0]?.impact || 'neutral',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          
          analyzedCount++;
          console.log(`Analyzed: ${news.title.substring(0, 50)}...`);
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Error analyzing news ${doc.id}:`, error.message);
      }
    }
    
    await batch.commit();
    
    res.json({
      success: true,
      message: `News analysis completed`,
      results: {
        total: newsSnapshot.size,
        analyzed: analyzedCount,
        skipped: skippedCount
      }
    });
    
  } catch (error) {
    console.error('Error in news analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});