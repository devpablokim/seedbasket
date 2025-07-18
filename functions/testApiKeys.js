const functions = require('firebase-functions');

exports.testApiKeys = functions.https.onRequest(async (req, res) => {
  const config = functions.config();
  
  const apiKeys = {
    finnhub: {
      configured: !!config.finnhub?.api_key,
      keyLength: config.finnhub?.api_key?.length || 0,
      firstChars: config.finnhub?.api_key?.substring(0, 10) + '...' || 'NOT SET'
    },
    alpha_vantage: {
      configured: !!config.alpha_vantage?.api_key,
      keyLength: config.alpha_vantage?.api_key?.length || 0,
      firstChars: config.alpha_vantage?.api_key?.substring(0, 10) + '...' || 'NOT SET'
    },
    openai: {
      configured: !!config.openai?.api_key,
      keyLength: config.openai?.api_key?.length || 0,
      firstChars: config.openai?.api_key?.substring(0, 10) + '...' || 'NOT SET'
    },
    newsapi: {
      configured: !!config.newsapi?.key,
      keyLength: config.newsapi?.key?.length || 0,
      firstChars: config.newsapi?.key?.substring(0, 10) + '...' || 'NOT SET'
    }
  };
  
  // Test Finnhub API
  let finnhubTest = 'NOT TESTED';
  if (config.finnhub?.api_key) {
    try {
      const axios = require('axios');
      const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
        params: {
          symbol: 'AAPL',
          token: config.finnhub.api_key
        }
      });
      finnhubTest = response.data.c ? 'SUCCESS' : 'NO DATA';
    } catch (error) {
      finnhubTest = `ERROR: ${error.response?.data?.error || error.message}`;
    }
  }
  
  res.json({
    message: 'API Keys Test',
    apiKeys,
    finnhubTest,
    timestamp: new Date().toISOString()
  });
});