# Free Market Data APIs for SEED BASKET AI

## Currently Integrated APIs

### 1. Finnhub (Free Tier)
- **Rate Limit**: 60 calls/minute
- **Features Available**:
  - Real-time stock quotes
  - Company news
  - Market news
  - Basic market data
- **Features NOT Available** (Premium only):
  - ETF Profile
  - ETF Holdings
  - Analyst recommendations
  - Earnings data

### 2. Alpha Vantage (Free Tier)
- **Rate Limit**: 5 calls/minute, 500 calls/day
- **Features Available**:
  - Real-time quotes
  - Historical data
  - Technical indicators
  - Fundamental data
- **Best For**: Backup when Finnhub rate limit is reached

### 3. NewsAPI
- **Rate Limit**: 500 requests/day (free tier)
- **Features**: Business and financial news from multiple sources

## Additional Free APIs You Can Consider

### 1. Twelve Data
- **Website**: https://twelvedata.com/
- **Free Tier**: 800 API calls/day, 8 requests/minute
- **Features**: Real-time & historical stock data, technical indicators
- **API Key Variable**: `TWELVEDATA_API_KEY`

### 2. Yahoo Finance (via RapidAPI)
- **Website**: https://rapidapi.com/apidojo/api/yahoo-finance1
- **Free Tier**: 500 requests/month
- **Features**: Comprehensive stock data, news, financials
- **Note**: Requires RapidAPI account

### 3. IEX Cloud
- **Website**: https://iexcloud.io/
- **Free Tier**: 50,000 messages/month
- **Features**: Real-time prices, company data, news
- **API Key Variable**: `IEX_API_KEY`

### 4. Polygon.io
- **Website**: https://polygon.io/
- **Free Tier**: 5 API calls/minute
- **Features**: Real-time & historical data, technical indicators
- **API Key Variable**: `POLYGON_API_KEY`

### 5. Marketstack
- **Website**: https://marketstack.com/
- **Free Tier**: 1,000 requests/month
- **Features**: End-of-day data, intraday data (1 year historical)
- **API Key Variable**: `MARKETSTACK_API_KEY`

### 6. Financial Modeling Prep
- **Website**: https://financialmodelingprep.com/
- **Free Tier**: 250 requests/day
- **Features**: Financial statements, real-time stock prices
- **API Key Variable**: `FMP_API_KEY`

## Integration Priority

Based on your needs, here's the recommended priority for adding new APIs:

1. **Twelve Data** - Good rate limits, comprehensive data
2. **IEX Cloud** - High monthly limit, reliable data
3. **Polygon.io** - Real-time WebSocket support
4. **Financial Modeling Prep** - Good for fundamental data

## How to Add New APIs

1. Get API key from the provider
2. Add to `.env` file:
   ```
   TWELVEDATA_API_KEY=your_key_here
   IEX_API_KEY=your_key_here
   ```

3. Update `marketDataService.js` to include new API functions

4. The system will automatically use them as fallback options

## Current Implementation

The system now uses a smart fallback mechanism:
1. Try Finnhub first (best rate limit)
2. Fall back to Alpha Vantage if needed
3. Can add more APIs as additional fallbacks

This ensures maximum uptime and data availability while respecting rate limits.