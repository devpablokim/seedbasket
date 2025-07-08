const axios = require('axios');
const { MarketData, MarketDataHistory } = require('../models');
const { Op } = require('sequelize');

// API configuration
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Top 50+ ETFs by trading volume and AUM
const ETF_SYMBOLS = [
  // Core Market ETFs
  'SPY', 'IVV', 'VOO', 'VTI', 'QQQ', 'IWM', 'DIA', 'MDY', 'RSP', 'SPLG',
  // Sector ETFs  
  'XLF', 'XLK', 'XLE', 'XLV', 'XLI', 'XLY', 'XLP', 'XLB', 'XLRE', 'XLU',
  // International ETFs
  'EFA', 'VEA', 'IEFA', 'VWO', 'IEMG', 'EEM', 'FXI', 'EWZ', 'EWJ', 'INDA',
  // Fixed Income ETFs
  'AGG', 'BND', 'LQD', 'HYG', 'TLT', 'IEF', 'SHY', 'TIP', 'MUB', 'EMB',
  // Growth/Value ETFs
  'VUG', 'VTV', 'IWF', 'IWD', 'VBR', 'VBK', 'SCHG', 'SCHV', 'RPG', 'RPV',
  // Specialty ETFs
  'ARKK', 'ARKG', 'ARKQ', 'ARKW', 'ARKF', 'ICLN', 'TAN', 'LIT', 'HACK', 'ROBO',
  // Dividend ETFs
  'VYM', 'SCHD', 'DVY', 'VIG', 'SDY', 'HDV', 'DGRO', 'DGRW', 'NOBL', 'SPHD'
];

// Expanded Commodity ETFs and ETNs
const COMMODITY_SYMBOLS = [
  // Precious Metals
  { symbol: 'GLD', name: 'SPDR Gold Shares' },
  { symbol: 'SLV', name: 'iShares Silver Trust' },
  { symbol: 'PPLT', name: 'Aberdeen Platinum ETF' },
  { symbol: 'PALL', name: 'Aberdeen Palladium ETF' },
  // Energy
  { symbol: 'USO', name: 'United States Oil Fund' },
  { symbol: 'UNG', name: 'United States Natural Gas Fund' },
  { symbol: 'BNO', name: 'United States Brent Oil Fund' },
  { symbol: 'UCO', name: 'ProShares Ultra Crude Oil' },
  // Agriculture  
  { symbol: 'DBA', name: 'Invesco DB Agriculture Fund' },
  { symbol: 'CORN', name: 'Teucrium Corn Fund' },
  { symbol: 'WEAT', name: 'Teucrium Wheat Fund' },
  { symbol: 'SOYB', name: 'Teucrium Soybean Fund' },
  { symbol: 'COW', name: 'iPath Livestock ETN' },
  // Broad Commodities
  { symbol: 'DBC', name: 'Invesco DB Commodity Tracking' },
  { symbol: 'GSG', name: 'iShares S&P GSCI Commodity' },
  // Industrial Metals
  { symbol: 'COPX', name: 'Global X Copper Miners ETF' },
  { symbol: 'DBB', name: 'Invesco DB Base Metals Fund' }
];

// ETF name mapping
const ETF_NAMES = {
  // Core Market ETFs
  'SPY': 'SPDR S&P 500 ETF',
  'IVV': 'iShares Core S&P 500 ETF',
  'VOO': 'Vanguard S&P 500 ETF',
  'VTI': 'Vanguard Total Stock Market ETF',
  'QQQ': 'Invesco QQQ Trust',
  'IWM': 'iShares Russell 2000 ETF',
  'DIA': 'SPDR Dow Jones Industrial Average ETF',
  'MDY': 'SPDR S&P MidCap 400 ETF',
  'RSP': 'Invesco S&P 500 Equal Weight ETF',
  'SPLG': 'SPDR Portfolio S&P 500 ETF',
  // Sector ETFs
  'XLF': 'Financial Select Sector SPDR',
  'XLK': 'Technology Select Sector SPDR',
  'XLE': 'Energy Select Sector SPDR',
  'XLV': 'Health Care Select Sector SPDR',
  'XLI': 'Industrial Select Sector SPDR',
  'XLY': 'Consumer Discretionary Select SPDR',
  'XLP': 'Consumer Staples Select Sector SPDR',
  'XLB': 'Materials Select Sector SPDR',
  'XLRE': 'Real Estate Select Sector SPDR',
  'XLU': 'Utilities Select Sector SPDR',
  // International ETFs
  'EFA': 'iShares MSCI EAFE ETF',
  'VEA': 'Vanguard FTSE Developed Markets ETF',
  'IEFA': 'iShares Core MSCI EAFE ETF',
  'VWO': 'Vanguard FTSE Emerging Markets ETF',
  'IEMG': 'iShares Core MSCI Emerging Markets ETF',
  'EEM': 'iShares MSCI Emerging Markets ETF',
  'FXI': 'iShares China Large-Cap ETF',
  'EWZ': 'iShares MSCI Brazil ETF',
  'EWJ': 'iShares MSCI Japan ETF',
  'INDA': 'iShares MSCI India ETF',
  // Fixed Income ETFs
  'AGG': 'iShares Core U.S. Aggregate Bond ETF',
  'BND': 'Vanguard Total Bond Market ETF',
  'LQD': 'iShares iBoxx Investment Grade Corp Bond ETF',
  'HYG': 'iShares iBoxx High Yield Corp Bond ETF',
  'TLT': 'iShares 20+ Year Treasury Bond ETF',
  'IEF': 'iShares 7-10 Year Treasury Bond ETF',
  'SHY': 'iShares 1-3 Year Treasury Bond ETF',
  'TIP': 'iShares TIPS Bond ETF',
  'MUB': 'iShares National Muni Bond ETF',
  'EMB': 'iShares Emerging Markets Bond ETF',
  // Growth/Value ETFs
  'VUG': 'Vanguard Growth ETF',
  'VTV': 'Vanguard Value ETF',
  'IWF': 'iShares Russell 1000 Growth ETF',
  'IWD': 'iShares Russell 1000 Value ETF',
  'VBR': 'Vanguard Small-Cap Value ETF',
  'VBK': 'Vanguard Small-Cap Growth ETF',
  'SCHG': 'Schwab U.S. Large-Cap Growth ETF',
  'SCHV': 'Schwab U.S. Large-Cap Value ETF',
  'RPG': 'Invesco S&P 500 Pure Growth ETF',
  'RPV': 'Invesco S&P 500 Pure Value ETF',
  // ARK ETFs
  'ARKK': 'ARK Innovation ETF',
  'ARKG': 'ARK Genomic Revolution ETF',
  'ARKQ': 'ARK Autonomous Tech & Robotics ETF',
  'ARKW': 'ARK Next Generation Internet ETF',
  'ARKF': 'ARK Fintech Innovation ETF',
  // Thematic ETFs
  'ICLN': 'iShares Global Clean Energy ETF',
  'TAN': 'Invesco Solar ETF',
  'LIT': 'Global X Lithium & Battery Tech ETF',
  'HACK': 'ETFMG Prime Cyber Security ETF',
  'ROBO': 'ROBO Global Robotics & Automation ETF',
  // Dividend ETFs
  'VYM': 'Vanguard High Dividend Yield ETF',
  'SCHD': 'Schwab U.S. Dividend Equity ETF',
  'DVY': 'iShares Select Dividend ETF',
  'VIG': 'Vanguard Dividend Appreciation ETF',
  'SDY': 'SPDR S&P Dividend ETF',
  'HDV': 'iShares Core High Dividend ETF',
  'DGRO': 'iShares Core Dividend Growth ETF',
  'DGRW': 'WisdomTree U.S. Quality Dividend Growth',
  'NOBL': 'ProShares S&P 500 Dividend Aristocrats',
  'SPHD': 'Invesco S&P 500 High Dividend Low Vol',
  // Additional ETFs from original list
  'IJH': 'iShares Core S&P Mid-Cap ETF',
  'IJR': 'iShares Core S&P Small-Cap ETF',
  'VNQ': 'Vanguard Real Estate ETF',
  'ITOT': 'iShares Core S&P Total U.S. Stock Market ETF',
  'IWB': 'iShares Russell 1000 ETF',
  'VO': 'Vanguard Mid-Cap ETF',
  'IGSB': 'iShares Short-Term Corporate Bond ETF',
  'IVW': 'iShares S&P 500 Growth ETF',
  'VB': 'Vanguard Small-Cap ETF'
};

// Alpha Vantage functions
async function getAlphaVantageQuote(symbol) {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_KEY
      }
    });
    
    const quote = response.data['Global Quote'];
    if (!quote || !quote['05. price']) {
      return null;
    }
    
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      previousClose: parseFloat(quote['08. previous close']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      open: parseFloat(quote['02. open']),
      volume: parseInt(quote['06. volume'])
    };
  } catch (error) {
    console.error(`Alpha Vantage error for ${symbol}:`, error.message);
    return null;
  }
}

// Finnhub functions (free tier)
async function getFinnhubQuote(symbol) {
  if (!FINNHUB_API_KEY) return null;
  
  try {
    const response = await axios.get('https://finnhub.io/api/v1/quote', {
      params: {
        symbol: symbol,
        token: FINNHUB_API_KEY
      }
    });
    
    const data = response.data;
    if (!data || data.c === 0) {
      return null;
    }
    
    return {
      symbol: symbol,
      price: data.c,
      previousClose: data.pc,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o
    };
  } catch (error) {
    console.error(`Finnhub error for ${symbol}:`, error.message);
    return null;
  }
}

// Combined update function
async function updateMarketData() {
  console.log('Starting combined market data update...');
  
  let successCount = 0;
  let errorCount = 0;
  let finnhubCallCount = 0;
  let alphaVantageCallCount = 0;
  
  // Update ETFs
  for (let i = 0; i < ETF_SYMBOLS.length; i++) {
    const symbol = ETF_SYMBOLS[i];
    
    try {
      let data = null;
      
      // Try Finnhub first (60 calls/minute limit)
      if (finnhubCallCount < 55) { // Leave some buffer
        data = await getFinnhubQuote(symbol);
        if (data) finnhubCallCount++;
      }
      
      // If Finnhub fails or limit reached, try Alpha Vantage (5 calls/minute)
      if (!data && alphaVantageCallCount < 4) { // Leave buffer
        console.log(`Trying Alpha Vantage for ${symbol}...`);
        data = await getAlphaVantageQuote(symbol);
        if (data) alphaVantageCallCount++;
      }
      
      if (data) {
        const etfName = ETF_NAMES[symbol] || symbol;
        
        await MarketData.upsert({
          symbol: data.symbol,
          name: etfName,
          type: 'ETF',
          price: data.price,
          previousClose: data.previousClose,
          change: data.change,
          changePercent: data.changePercent,
          high: data.high || data.price,
          low: data.low || data.price,
          open: data.open || data.price,
          volume: data.volume || 0,
          marketCap: 0,
          lastUpdated: new Date()
        });
        
        // Save to history
        await MarketDataHistory.create({
          symbol: data.symbol,
          price: data.price,
          volume: data.volume || 0,
          recordedAt: new Date()
        });
        
        successCount++;
        console.log(`Updated ${symbol} (${successCount}/${ETF_SYMBOLS.length})`);
      } else {
        errorCount++;
        console.error(`Failed to get data for ${symbol}`);
      }
      
      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      // Reset counters every minute
      if (i > 0 && i % 50 === 0) {
        console.log('Waiting 60 seconds for rate limit reset...');
        await new Promise(resolve => setTimeout(resolve, 60000));
        finnhubCallCount = 0;
        alphaVantageCallCount = 0;
      }
      
    } catch (error) {
      errorCount++;
      console.error(`Error updating ${symbol}:`, error.message);
    }
  }
  
  // Update commodities
  for (const commodity of COMMODITY_SYMBOLS) {
    try {
      let data = await getFinnhubQuote(commodity.symbol);
      if (!data) {
        data = await getAlphaVantageQuote(commodity.symbol);
      }
      
      if (data) {
        await MarketData.upsert({
          symbol: commodity.symbol,
          name: commodity.name,
          type: 'COMMODITY',
          price: data.price,
          previousClose: data.previousClose,
          change: data.change,
          changePercent: data.changePercent,
          high: data.high || data.price,
          low: data.low || data.price,
          open: data.open || data.price,
          volume: data.volume || 0,
          marketCap: 0,
          lastUpdated: new Date()
        });
        
        console.log(`Updated commodity ${commodity.symbol}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1100));
      
    } catch (error) {
      console.error(`Error updating commodity ${commodity.symbol}:`, error.message);
    }
  }
  
  console.log(`Market data update completed. Success: ${successCount}, Errors: ${errorCount}`);
  
  // Clean up old history data (keep only last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  await MarketDataHistory.destroy({
    where: {
      recordedAt: {
        [Op.lt]: ninetyDaysAgo
      }
    }
  });
}

module.exports = {
  updateMarketData,
  ETF_SYMBOLS,
  COMMODITY_SYMBOLS
};