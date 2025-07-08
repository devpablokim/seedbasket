const axios = require('axios');
const { MarketData, MarketDataHistory } = require('../models');

const TOP_ETFS = [
  'SPY', 'IVV', 'VOO', 'VTI', 'QQQ', 'VEA', 'VTV', 'IEFA', 'BND', 'VUG',
  'AGG', 'VWO', 'IJH', 'IWF', 'IEMG', 'IWM', 'VIG', 'GLD', 'VYM', 'EFA'
];

const COMMODITIES = {
  'GLD': 'Gold',
  'USO': 'Crude Oil'
};

async function fetchMarketDataFromAPI(symbol) {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    
    const response = await axios.get(url);
    const data = response.data['Global Quote'];
    
    if (!data || Object.keys(data).length === 0) {
      console.error(`No data found for symbol: ${symbol}`);
      return null;
    }

    return {
      symbol: data['01. symbol'],
      price: parseFloat(data['05. price']),
      previousClose: parseFloat(data['08. previous close']),
      change: parseFloat(data['09. change']),
      changePercent: parseFloat(data['10. change percent'].replace('%', '')),
      volume: parseInt(data['06. volume'])
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error.message);
    return null;
  }
}

async function updateMarketData() {
  try {
    console.log('Starting market data update...');
    
    const symbolsToUpdate = [...TOP_ETFS];
    
    for (const symbol of symbolsToUpdate) {
      const marketData = await fetchMarketDataFromAPI(symbol);
      
      if (marketData) {
        const type = COMMODITIES[symbol] ? 'COMMODITY' : 'ETF';
        const name = COMMODITIES[symbol] || symbol;
        
        await MarketData.upsert({
          symbol: marketData.symbol,
          name: name,
          type: type,
          price: marketData.price,
          previousClose: marketData.previousClose,
          change: marketData.change,
          changePercent: marketData.changePercent,
          volume: marketData.volume,
          lastUpdated: new Date()
        });
        
        // Also save to historical data
        await MarketDataHistory.create({
          symbol: marketData.symbol,
          name: name,
          type: type,
          price: marketData.price,
          previousClose: marketData.previousClose,
          change: marketData.change,
          changePercent: marketData.changePercent,
          volume: marketData.volume,
          recordedAt: new Date()
        });
        
        console.log(`Updated ${symbol}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 12000));
    }
    
    console.log('Market data update completed');
  } catch (error) {
    console.error('Error updating market data:', error);
  }
}

module.exports = {
  updateMarketData
};