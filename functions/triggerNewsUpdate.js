const functions = require('firebase-functions');

exports.triggerNewsUpdate = functions.https.onRequest(async (req, res) => {
  try {
    const { fetchLatestNews } = require('./services/newsService');
    
    console.log('Manually triggering news update with AI analysis...');
    
    await fetchLatestNews();
    
    res.json({
      success: true,
      message: 'News update with AI analysis completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error triggering news update:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});