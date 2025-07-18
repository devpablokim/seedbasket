const axios = require('axios');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebaseData = require('./firebaseDataService');

// API configuration - use Firebase config in production, env vars in development
const ALPHA_VANTAGE_KEY = functions.config().alpha_vantage?.api_key || process.env.ALPHA_VANTAGE_API_KEY;
const FINNHUB_API_KEYS = [
  functions.config().finnhub?.api_key || process.env.FINNHUB_API_KEY,
  functions.config().finnhub?.api_key2 || process.env.FINNHUB_API_KEY2,
  functions.config().finnhub?.api_key3 || process.env.FINNHUB_API_KEY3,
  functions.config().finnhub?.api_key4 || process.env.FINNHUB_API_KEY4
].filter(key => key);

let currentFinnhubKeyIndex = 0;

// Top 100+ most traded ETFs (alphabetically organized)
const ETF_SYMBOLS = [
  // A
  'AAXJ', 'ACWI', 'AGG', 'AMLP', 'ANGL', 'ARKF', 'ARKG', 'ARKK', 'ARKQ', 'ARKW', 'ASHR',
  // B
  'BIL', 'BITO', 'BKLN', 'BND', 'BNDX', 'BOTZ',
  // C
  'CLOU', 'CORN',
  // D
  'DBA', 'DBC', 'DBO', 'DGRO', 'DGRW', 'DIA', 'DJIA', 'DRIV', 'DUST', 'DVY', 'DXJ',
  // E
  'EEM', 'EEMV', 'EFA', 'EFAV', 'EMB', 'EMQQ', 'EMLC', 'EPP', 'ESGE', 'ESGV', 'ESGU', 'EWA', 'EWC', 'EWG', 'EWH', 'EWJ', 'EWL', 'EWM', 'EWS', 'EWT', 'EWU', 'EWW', 'EWY', 'EWZ', 'EZU',
  // F
  'FDN', 'FEZ', 'FLOT', 'FM', 'FNDE', 'FNDX', 'FTEC', 'FVD', 'FXI',
  // G
  'GDX', 'GDXJ', 'GLD', 'GLDM', 'GOVT', 'GRID', 'GSG', 'GUNR',
  // H
  'HACK', 'HDV', 'HEDJ', 'HYG', 'HYLD', 'HYMB',
  // I
  'IAU', 'IBB', 'ICLN', 'ICSH', 'IDV', 'IEF', 'IEFA', 'IEI', 'IEMG', 'INTF', 'IGSB', 'IGV', 'IJH', 'IJR', 'ILF', 'INDA', 'IPAY', 'ITA', 'ITB', 'ITOT', 'IUSB', 'IUSG', 'IUSV', 'IVE', 'IVV', 'IVW', 'IWB', 'IWD', 'IWF', 'IWM', 'IWN', 'IWO', 'IWP', 'IWR', 'IWS', 'IWV', 'IXN', 'IYE', 'IYF', 'IYH', 'IYR', 'IYW',
  // J
  'JEPI', 'JETS', 'JNK', 'JPST',
  // K
  'KBE', 'KIE', 'KOMP', 'KRE', 'KWEB',
  // L
  'LABU', 'LIT', 'LQD',
  // M
  'MCHI', 'MBB', 'MDY', 'MGK', 'MGV', 'MINT', 'MJ', 'MOAT', 'MOO', 'MTUM', 'MUB',
  // N
  'NEAR', 'NOBL', 'NUGT',
  // O
  'OEF', 'OIH',
  // P
  'PALL', 'PAVE', 'PBW', 'PCY', 'PDBC', 'PDP', 'PEY', 'PFF', 'PGX', 'PHO', 'PICK', 'PKW', 'PPLT', 'PSQ', 'PUI',
  // Q
  'QCLN', 'QDIV', 'QEFA', 'QID', 'QLD', 'QQQ', 'QQQJ', 'QQQM', 'QTEC', 'QUAL', 'QYLD',
  // R
  'REET', 'REM', 'REMX', 'REZ', 'ROBO', 'RPG', 'RPV', 'RSP', 'RSX', 'RTH', 'RUSL', 'RWR',
  // S
  'SCHA', 'SCHB', 'SCHD', 'SCHE', 'SCHF', 'SCHG', 'SCHH', 'SCHM', 'SCHO', 'SCHP', 'SCHV', 'SCHX', 'SCZ', 'SDIV', 'SDS', 'SDY', 'SH', 'SHV', 'SHY', 'SHYG', 'SILJ', 'SJNK', 'SKYY', 'SLV', 'SLVP', 'SLX', 'SLY', 'SMH', 'SOXL', 'SOXS', 'SOXX', 'SPAB', 'SPDN', 'SPDW', 'SPEM', 'SPHB', 'SPHD', 'SPHQ', 'SPHY', 'SPIB', 'SPLB', 'SPLG', 'SPLV', 'SPMB', 'SPMD', 'SPSB', 'SPSM', 'SPTL', 'SPTM', 'SPTS', 'SPXL', 'SPXS', 'SPXU', 'SPY', 'SPYD', 'SPYG', 'SPYV', 'SQQQ', 'SRLN', 'SUB',
  // T
  'TAN', 'TBF', 'TBT', 'TDOC', 'TFI', 'TFLO', 'THD', 'TIP', 'TIPX', 'TLH', 'TLT', 'TMF', 'TMV', 'TNA', 'TQQQ', 'TUR', 'TVIX', 'TZA',
  // U
  'UAUG', 'UBER', 'UCO', 'UDOW', 'UGA', 'UNG', 'UPRO', 'URA', 'URE', 'USHY', 'USMV', 'USO', 'UST', 'UUP', 'UVXY', 'UWM',
  // V
  'VAW', 'VB', 'VBK', 'VBR', 'VCIT', 'VCLT', 'VCR', 'VCSH', 'VDC', 'VDE', 'VEA', 'VEU', 'VFH', 'VGIT', 'VGK', 'VGLT', 'VGSH', 'VGT', 'VHT', 'VIG', 'VIGI', 'VIS', 'VIXY', 'VMBS', 'VNQ', 'VNQI', 'VO', 'VOE', 'VOO', 'VOOG', 'VOOV', 'VOT', 'VOX', 'VPL', 'VPU', 'VT', 'VTEB', 'VTI', 'VTIP', 'VTV', 'VUG', 'VV', 'VWO', 'VWOB', 'VXF', 'VXUS', 'VXX', 'VYM',
  // W
  'WEAT', 'WIP',
  // X
  'XAR', 'XBI', 'XES', 'XHB', 'XHE', 'XLB', 'XLC', 'XLE', 'XLF', 'XLI', 'XLK', 'XLP', 'XLRE', 'XLU', 'XLV', 'XLY', 'XME', 'XOP', 'XPH', 'XRT', 'XSD', 'XSW',
  // Y
  'YANG', 'YINN',
  // Z
  'ZSL'
];

// Expanded Commodity ETFs and ETNs
const COMMODITY_SYMBOLS = [
  // Precious Metals
  { symbol: 'GLD', name: 'SPDR Gold Shares' },
  { symbol: 'SLV', name: 'iShares Silver Trust' },
  { symbol: 'IAU', name: 'iShares Gold Trust' },
  { symbol: 'PPLT', name: 'abrdn Platinum ETF' },
  { symbol: 'PALL', name: 'abrdn Palladium ETF' },
  // Energy
  { symbol: 'USO', name: 'United States Oil Fund' },
  { symbol: 'UNG', name: 'United States Natural Gas Fund' },
  { symbol: 'BNO', name: 'United States Brent Oil Fund' },
  { symbol: 'UCO', name: 'ProShares Ultra Bloomberg Crude Oil' },
  // Agriculture
  { symbol: 'DBA', name: 'Invesco DB Agriculture Fund' },
  { symbol: 'CORN', name: 'Teucrium Corn Fund' },
  { symbol: 'WEAT', name: 'Teucrium Wheat Fund' },
  { symbol: 'SOYB', name: 'Teucrium Soybean Fund' },
  { symbol: 'CANE', name: 'Teucrium Sugar Fund' },
  // Base Metals & Materials
  { symbol: 'CPER', name: 'United States Copper Index Fund' },
  { symbol: 'DBB', name: 'Invesco DB Base Metals Fund' },
  { symbol: 'JJC', name: 'iPath Series B Bloomberg Copper ETN' }
];

// Finnhub API functions
// Function to get next API key
function getNextFinnhubKey() {
  if (FINNHUB_API_KEYS.length === 0) {
    throw new Error('No Finnhub API keys configured');
  }
  const key = FINNHUB_API_KEYS[currentFinnhubKeyIndex];
  currentFinnhubKeyIndex = (currentFinnhubKeyIndex + 1) % FINNHUB_API_KEYS.length;
  return key;
}

async function getQuoteFromFinnhub(symbol, retryCount = 0) {
  if (retryCount >= FINNHUB_API_KEYS.length) {
    console.error(`All Finnhub API keys exhausted for ${symbol}`);
    return null;
  }

  try {
    const apiKey = FINNHUB_API_KEYS[currentFinnhubKeyIndex];
    const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
      params: {
        symbol: symbol,
        token: apiKey
      }
    });
    
    const data = response.data;
    
    // Check if we got valid data
    if (!data || data.c === 0) {
      return null;
    }
    
    return {
      price: data.c,              // Current price
      change: data.d,             // Change
      changePercent: data.dp,     // Percent change
      high: data.h,               // High price of the day
      low: data.l,                // Low price of the day
      open: data.o,               // Open price of the day
      previousClose: data.pc,     // Previous close price
      timestamp: data.t           // Timestamp
    };
  } catch (error) {
    if (error.response?.data?.error?.includes('API limit reached')) {
      console.log(`API limit reached for key ${currentFinnhubKeyIndex + 1}, rotating to next key...`);
      currentFinnhubKeyIndex = (currentFinnhubKeyIndex + 1) % FINNHUB_API_KEYS.length;
      return getQuoteFromFinnhub(symbol, retryCount + 1);
    }
    console.error(`Finnhub API error for ${symbol}:`, error.response?.data || error.message);
    return null;
  }
}

// Alpha Vantage API function for volume data and backup quotes
async function getQuoteFromAlphaVantage(symbol) {
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_KEY
      }
    });

    const quote = response.data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      return null;
    }

    return {
      price: parseFloat(quote['05. price']),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      volume: parseInt(quote['06. volume']),
      previousClose: parseFloat(quote['08. previous close']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent'].replace('%', '')
    };
  } catch (error) {
    console.error(`Alpha Vantage API error for ${symbol}:`, error.message);
    return null;
  }
}

// Combined function to get best available data
async function getMarketDataCombined(symbol) {
  // Try Finnhub first (faster, real-time)
  const finnhubData = await getQuoteFromFinnhub(symbol);
  
  // If Finnhub has good data, try to get volume from Alpha Vantage
  if (finnhubData && finnhubData.price > 0) {
    const alphaData = await getQuoteFromAlphaVantage(symbol);
    
    return {
      ...finnhubData,
      volume: alphaData?.volume || 0,
      source: alphaData?.volume ? 'finnhub+alpha' : 'finnhub'
    };
  }
  
  // Fall back to Alpha Vantage only
  const alphaData = await getQuoteFromAlphaVantage(symbol);
  if (alphaData) {
    return {
      ...alphaData,
      source: 'alpha'
    };
  }
  
  return null;
}

// Get user searched symbols
async function getUserSearchedSymbols() {
  try {
    const firestore = admin.firestore();
    const doc = await firestore.collection('userSearchedSymbols').doc('symbols').get();
    if (!doc.exists) return [];
    return doc.data().symbols || [];
  } catch (error) {
    console.error('Error getting user searched symbols:', error);
    return [];
  }
}

// Function to update all market data
async function updateMarketData() {
  console.log('Starting market data update for Firestore...');
  
  // Get user searched symbols
  const userSearchedSymbols = await getUserSearchedSymbols();
  
  const allSymbols = [
    ...ETF_SYMBOLS.map(symbol => ({ symbol, type: 'etf', name: symbol })),
    ...COMMODITY_SYMBOLS.map(item => ({ ...item, type: 'commodity' })),
    ...userSearchedSymbols.map(symbol => ({ symbol, type: 'etf', name: symbol, userSearched: true }))
  ];
  
  const updatePromises = [];
  const batchData = [];
  
  // Process in smaller batches to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < allSymbols.length; i += batchSize) {
    const batch = allSymbols.slice(i, i + batchSize);
    
    await Promise.all(batch.map(async (item) => {
      try {
        const marketData = await getMarketDataCombined(item.symbol);
        
        if (marketData && marketData.price > 0) {
          const dataToSave = {
            symbol: item.symbol,
            name: item.name,
            type: item.type.toLowerCase(),
            latestPrice: marketData.price,
            price: marketData.price, // Keep both for compatibility
            previousClose: marketData.previousClose || 0,
            change: marketData.change || 0,
            changePercent: marketData.changePercent || 0,
            high: marketData.high || 0,
            low: marketData.low || 0,
            open: marketData.open || 0,
            volume: marketData.volume || 0,
            source: marketData.source,
            lastUpdated: new Date(),
            userSearched: item.userSearched || false
          };
          
          batchData.push(dataToSave);
          console.log(`Updated ${item.symbol}: $${marketData.price} (${marketData.changePercent}%)`);
        } else {
          console.log(`No data available for ${item.symbol}`);
        }
      } catch (error) {
        console.error(`Error updating ${item.symbol}:`, error.message);
      }
    }));
    
    // Small delay between batches to avoid rate limits
    if (i + batchSize < allSymbols.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Batch save to Firestore
  if (batchData.length > 0) {
    await firebaseData.batchSaveMarketData(batchData);
    console.log(`Successfully updated ${batchData.length} market data records in Firestore`);
    
    // Also cache the latest data
    const etfs = batchData.filter(d => d.type === 'etf');
    const commodities = batchData.filter(d => d.type === 'commodity');
    await firebaseData.setCachedData('latest_market_data', { etfs, commodities });
  }
  
  console.log('Market data update completed');
}

// Get top gainers and losers
async function getTopMovers() {
  try {
    const allData = await firebaseData.getAllMarketData();
    
    const sortedByChange = allData
      .filter(item => item.changePercent !== null && item.changePercent !== 0)
      .sort((a, b) => b.changePercent - a.changePercent);
    
    return {
      gainers: sortedByChange.slice(0, 5),
      losers: sortedByChange.slice(-5).reverse()
    };
  } catch (error) {
    console.error('Error getting top movers:', error);
    return { gainers: [], losers: [] };
  }
}

// Scheduled function export for Firebase Functions
exports.scheduledMarketUpdate = functions.pubsub
  .schedule('0 * * * *')  // Run at minute 0 of every hour
  .timeZone('America/New_York')
  .onRun(async (context) => {
    console.log('Running scheduled market data update at', new Date());
    await updateMarketData();
    return null;
  });

module.exports = {
  updateMarketData,
  getTopMovers,
  ETF_SYMBOLS,
  COMMODITY_SYMBOLS,
  scheduledMarketUpdate: exports.scheduledMarketUpdate
};