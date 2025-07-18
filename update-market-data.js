require('dotenv').config({ path: './backend/.env' });
const { updateMarketData } = require('./backend/services/marketDataServiceFirebase');

async function forceUpdateMarketData() {
  console.log('🔄 Starting market data update...');
  console.log('Alpha Vantage API Key:', process.env.ALPHA_VANTAGE_API_KEY ? '✅ Found' : '❌ Missing');
  console.log('Finnhub API Key:', process.env.FINNHUB_API_KEY ? '✅ Found' : '❌ Missing');
  
  try {
    await updateMarketData();
    console.log('✅ Market data update completed successfully');
  } catch (error) {
    console.error('❌ Error updating market data:', error);
  }
  
  // Exit after completion
  process.exit(0);
}

forceUpdateMarketData();