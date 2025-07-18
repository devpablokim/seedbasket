// Mock data for testing layout
export const mockMarketData = {
  etfs: [
    {
      symbol: 'SPY',
      name: 'SPDR S&P 500 ETF Trust',
      type: 'ETF',
      price: 620.68,
      previousClose: 615.43,
      change: 5.25,
      changePercent: 0.85,
      high: 622.10,
      low: 618.55,
      open: 619.20,
      volume: 45678900,
      marketCap: 567890000000
    },
    {
      symbol: 'QQQ',
      name: 'Invesco QQQ Trust',
      type: 'ETF',
      price: 552.03,
      previousClose: 548.21,
      change: 3.82,
      changePercent: 0.70,
      high: 554.20,
      low: 550.10,
      open: 551.00,
      volume: 23456789,
      marketCap: 234567000000
    },
    {
      symbol: 'DIA',
      name: 'SPDR Dow Jones Industrial Average ETF',
      type: 'ETF',
      price: 428.90,
      previousClose: 426.55,
      change: 2.35,
      changePercent: 0.55,
      high: 430.00,
      low: 427.80,
      open: 428.00,
      volume: 3456789,
      marketCap: 34567000000
    },
    {
      symbol: 'IWM',
      name: 'iShares Russell 2000 ETF',
      type: 'ETF',
      price: 224.30,
      previousClose: 226.80,
      change: -2.50,
      changePercent: -1.10,
      high: 226.00,
      low: 223.50,
      open: 225.80,
      volume: 12345678,
      marketCap: 45678000000
    },
    {
      symbol: 'VTI',
      name: 'Vanguard Total Stock Market ETF',
      type: 'ETF',
      price: 283.45,
      previousClose: 282.10,
      change: 1.35,
      changePercent: 0.48,
      high: 284.00,
      low: 282.50,
      open: 282.90,
      volume: 2345678,
      marketCap: 345678000000
    },
    {
      symbol: 'XLK',
      name: 'Technology Select Sector SPDR Fund',
      type: 'ETF',
      price: 242.80,
      previousClose: 239.90,
      change: 2.90,
      changePercent: 1.21,
      high: 243.50,
      low: 241.20,
      open: 241.00,
      volume: 5678901,
      marketCap: 56789000000
    },
    {
      symbol: 'XLF',
      name: 'Financial Select Sector SPDR Fund',
      type: 'ETF',
      price: 48.25,
      previousClose: 47.90,
      change: 0.35,
      changePercent: 0.73,
      high: 48.40,
      low: 47.85,
      open: 48.00,
      volume: 34567890,
      marketCap: 34567000000
    },
    {
      symbol: 'GLD',
      name: 'SPDR Gold Trust',
      type: 'ETF',
      price: 307.37,
      previousClose: 305.20,
      change: 2.17,
      changePercent: 0.71,
      high: 308.00,
      low: 306.50,
      open: 306.80,
      volume: 4567890,
      marketCap: 89012000000
    }
  ],
  commodities: [
    {
      symbol: 'USO',
      name: 'United States Oil Fund',
      type: 'COMMODITY',
      price: 76.48,
      previousClose: 75.30,
      change: 1.18,
      changePercent: 1.57,
      high: 77.00,
      low: 75.80,
      open: 76.00,
      volume: 8901234,
      marketCap: 2345600000
    },
    {
      symbol: 'UNG',
      name: 'United States Natural Gas Fund',
      type: 'COMMODITY',
      price: 21.45,
      previousClose: 21.80,
      change: -0.35,
      changePercent: -1.61,
      high: 21.90,
      low: 21.30,
      open: 21.75,
      volume: 4567890,
      marketCap: 890120000
    },
    {
      symbol: 'DBA',
      name: 'Invesco DB Agriculture Fund',
      type: 'COMMODITY',
      price: 32.18,
      previousClose: 32.00,
      change: 0.18,
      changePercent: 0.56,
      high: 32.30,
      low: 31.95,
      open: 32.10,
      volume: 567890,
      marketCap: 567890000
    },
    {
      symbol: 'DBB',
      name: 'Invesco DB Base Metals Fund',
      type: 'COMMODITY',
      price: 24.75,
      previousClose: 24.50,
      change: 0.25,
      changePercent: 1.02,
      high: 24.85,
      low: 24.45,
      open: 24.60,
      volume: 234567,
      marketCap: 234567000
    },
    {
      symbol: 'DBC',
      name: 'Invesco DB Commodity Index Tracking Fund',
      type: 'COMMODITY',
      price: 29.80,
      previousClose: 29.55,
      change: 0.25,
      changePercent: 0.85,
      high: 29.95,
      low: 29.60,
      open: 29.70,
      volume: 1234567,
      marketCap: 1234500000
    }
  ]
};

export const mockNews = [
  {
    id: '1',
    title: 'Federal Reserve Maintains Interest Rates, Signals Future Cuts',
    summary: 'The Federal Reserve kept interest rates unchanged but hinted at potential rate cuts in the coming months as inflation shows signs of cooling.',
    source: 'Reuters',
    url: '#',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'macro',
    impactedETFs: ['SPY', 'QQQ', 'TLT', 'DIA']
  },
  {
    id: '2',
    title: 'Oil Prices Surge on Middle East Tensions',
    summary: 'Crude oil futures jumped 3% as geopolitical tensions in the Middle East raise concerns about supply disruptions.',
    source: 'Bloomberg',
    url: '#',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    category: 'commodity',
    impactedETFs: ['USO', 'XLE', 'DBC']
  },
  {
    id: '3',
    title: 'Tech Earnings Beat Expectations Across the Board',
    summary: 'Major technology companies reported better-than-expected earnings, driving optimism in the tech sector.',
    source: 'CNBC',
    url: '#',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    category: 'market',
    impactedETFs: ['QQQ', 'XLK', 'SOXX', 'ARKK']
  },
  {
    id: '4',
    title: 'Gold Reaches New High Amid Global Uncertainty',
    summary: 'Gold prices hit a new record as investors seek safe-haven assets amid ongoing economic uncertainties.',
    source: 'Financial Times',
    url: '#',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    category: 'commodity',
    impactedETFs: ['GLD', 'SLV', 'IAU']
  },
  {
    id: '5',
    title: 'Manufacturing Data Shows Stronger Than Expected Growth',
    summary: 'U.S. manufacturing activity expanded at a faster pace than anticipated, suggesting economic resilience.',
    source: 'Wall Street Journal',
    url: '#',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    category: 'macro',
    impactedETFs: ['DIA', 'XLI', 'IWM']
  }
];