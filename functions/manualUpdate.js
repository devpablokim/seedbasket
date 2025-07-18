const functions = require('firebase-functions');
const axios = require('axios');

exports.manualMarketUpdate = functions.https.onRequest(async (req, res) => {
  const config = functions.config();
  
  console.log('Starting manual market update...');
  
  // Get Finnhub API key
  const FINNHUB_API_KEY = config.finnhub?.api_key || process.env.FINNHUB_API_KEY;
  
  if (!FINNHUB_API_KEY) {
    return res.status(500).json({ error: 'Finnhub API key not configured' });
  }
  
  // Import after checking API key
  const firebaseData = require('./services/firebaseDataService');
  
  // All ETFs and Commodities
  const allSymbols = [
    // Core ETFs
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF' },
    { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', type: 'ETF' },
    { symbol: 'IWM', name: 'iShares Russell 2000 ETF', type: 'ETF' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF' },
    { symbol: 'EEM', name: 'iShares MSCI Emerging Markets ETF', type: 'ETF' },
    // Sector ETFs
    { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund', type: 'ETF' },
    { symbol: 'XLE', name: 'Energy Select Sector SPDR Fund', type: 'ETF' },
    { symbol: 'XLK', name: 'Technology Select Sector SPDR Fund', type: 'ETF' },
    { symbol: 'XLV', name: 'Health Care Select Sector SPDR Fund', type: 'ETF' },
    // Commodity ETFs
    { symbol: 'GLD', name: 'SPDR Gold Trust', type: 'ETF' },
    { symbol: 'SLV', name: 'iShares Silver Trust', type: 'ETF' },
    { symbol: 'VNQ', name: 'Vanguard Real Estate ETF', type: 'ETF' },
    { symbol: 'ARKK', name: 'ARK Innovation ETF', type: 'ETF' },
    { symbol: 'HYG', name: 'iShares iBoxx $ High Yield Corporate Bond ETF', type: 'ETF' },
    { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', type: 'ETF' },
    { symbol: 'SOXX', name: 'iShares Semiconductor ETF', type: 'ETF' },
    { symbol: 'XBI', name: 'SPDR S&P Biotech ETF', type: 'ETF' },
    { symbol: 'ICLN', name: 'iShares Global Clean Energy ETF', type: 'ETF' },
    { symbol: 'JETS', name: 'U.S. Global Jets ETF', type: 'ETF' },
    // Commodities
    { symbol: 'USO', name: 'United States Oil Fund', type: 'COMMODITY' },
    { symbol: 'UNG', name: 'United States Natural Gas Fund', type: 'COMMODITY' },
    { symbol: 'DBA', name: 'Invesco DB Agriculture Fund', type: 'COMMODITY' },
    { symbol: 'DBB', name: 'Invesco DB Base Metals Fund', type: 'COMMODITY' },
    { symbol: 'DBC', name: 'Invesco DB Commodity Index Tracking Fund', type: 'COMMODITY' }
  ];
  
  const results = [];
  
  for (const item of allSymbols) {
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
        params: {
          symbol: item.symbol,
          token: FINNHUB_API_KEY
        }
      });
      
      const data = response.data;
      
      if (data && data.c > 0) {
        const marketData = {
          symbol: item.symbol,
          name: item.name,
          type: item.type,
          price: data.c,
          previousClose: data.pc,
          change: data.d,
          changePercent: data.dp,
          high: data.h,
          low: data.l,
          open: data.o,
          volume: 0, // Finnhub doesn't provide volume in basic quote
          lastUpdated: new Date()
        };
        
        await firebaseData.saveMarketData(item.symbol, marketData);
        
        results.push({
          symbol: item.symbol,
          status: 'success',
          price: data.c
        });
      } else {
        results.push({
          symbol: item.symbol,
          status: 'no data'
        });
      }
    } catch (error) {
      results.push({
        symbol: item.symbol,
        status: 'error',
        error: error.response?.data?.error || error.message
      });
    }
    
    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  res.json({
    message: 'Manual market update completed',
    results,
    timestamp: new Date().toISOString()
  });
});