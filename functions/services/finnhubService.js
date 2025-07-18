const axios = require('axios');
const functions = require('firebase-functions');
const firebaseData = require('./firebaseDataService');
const { analyzeNewsImpact } = require('./aiService');

const FINNHUB_API_KEY = functions.config().finnhub?.api_key || process.env.FINNHUB_API_KEY || 'ct7fgm9r01qht2qng4v0ct7fgm9r01qht2qng4vg';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

// ETF 심볼 목록
const ETF_SYMBOLS = [
  'SPY', 'IVV', 'VOO', 'VTI', 'QQQ', 'VEA', 'VTV', 'IEFA', 'BND', 'VUG',
  'AGG', 'VWO', 'IJH', 'IWF', 'IEMG', 'IWM', 'VIG', 'GLD', 'VYM', 'EFA',
  'IWD', 'IJR', 'VNQ', 'ITOT', 'IWB', 'VO', 'IGSB', 'IVW', 'VB', 'SCHD'
];

// Finnhub에서 ETF 프로필 가져오기 (Premium feature - disabled for free tier)
async function getETFProfile(symbol) {
  // ETF profile is a premium feature, not available in free tier
  return null;
}

// Finnhub에서 실시간 가격 가져오기
async function getQuote(symbol) {
  try {
    const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
      params: {
        symbol: symbol,
        token: FINNHUB_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error.message);
    return null;
  }
}

// Finnhub에서 회사 뉴스 가져오기
async function getCompanyNews(symbol, from, to) {
  try {
    const response = await axios.get(`${FINNHUB_BASE_URL}/company-news`, {
      params: {
        symbol: symbol,
        from: from,
        to: to,
        token: FINNHUB_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching company news for ${symbol}:`, error.message);
    return [];
  }
}

// 시장 뉴스 가져오기
async function getMarketNews(category = 'general') {
  try {
    const response = await axios.get(`${FINNHUB_BASE_URL}/news`, {
      params: {
        category: category, // general, forex, crypto, merger
        token: FINNHUB_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching market news:`, error.message);
    return [];
  }
}

// ETF 홀딩스 가져오기 (Premium feature - disabled for free tier)
async function getETFHoldings(symbol) {
  // ETF holdings is a premium feature, not available in free tier
  return null;
}

// 모든 ETF 데이터 업데이트
async function updateAllETFData() {
  console.log('Starting Finnhub ETF data update...');
  
  for (const symbol of ETF_SYMBOLS) {
    try {
      // 실시간 가격 데이터 가져오기
      const quote = await getQuote(symbol);
      if (quote && quote.c) { // c = current price
        // ETF 프로필 가져오기
        const profile = await getETFProfile(symbol);
        
        await firebaseData.saveMarketData(symbol, {
          name: profile?.name || symbol,
          type: 'ETF',
          price: quote.c,
          previousClose: quote.pc,
          change: quote.d,
          changePercent: quote.dp,
          high: quote.h,
          low: quote.l,
          open: quote.o,
          volume: 0, // Finnhub doesn't provide volume in quote
          lastUpdated: new Date()
        });
        
        console.log(`Updated ${symbol} from Finnhub`);
      }
      
      // Rate limit: 60 calls/minute for free tier
      await new Promise(resolve => setTimeout(resolve, 1100)); // Slightly slower to ensure we stay under limit
    } catch (error) {
      console.error(`Error updating ${symbol}:`, error.message);
    }
  }
}

// 뉴스 수집 및 AI 분석
async function fetchAndAnalyzeFinnhubNews() {
  console.log('Fetching news from Finnhub...');
  
  try {
    // 1. 일반 시장 뉴스 가져오기
    const marketNews = await getMarketNews('general');
    
    // 2. 주요 ETF 관련 회사 뉴스 가져오기
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fromDate = weekAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    // SPY 관련 뉴스 (S&P 500 대표)
    const spyNews = await getCompanyNews('SPY', fromDate, toDate);
    
    // 모든 뉴스 합치기
    const allNews = [...marketNews, ...spyNews];
    
    // 3. 각 뉴스에 대해 AI 분석 및 저장
    for (const article of allNews) {
      if (!article.headline || !article.url) continue;
      
      // GPT로 ETF 관련성 분석
      const isRelevant = await analyzeNewsRelevance(article.headline, article.summary);
      if (!isRelevant) continue;
      
      // 카테고리 결정
      const category = determineCategory(article.headline, article.summary);
      
      // 뉴스 저장
      const newsId = await firebaseData.saveNews({
        title: article.headline,
        summary: article.summary,
        source: article.source || 'Finnhub',
        url: article.url,
        publishedAt: new Date(article.datetime * 1000), // Unix timestamp to Date
        category: category
      });
      
      // AI로 ETF 영향 분석
      if (newsId) {
        const etfList = await firebaseData.getETFs();
        
        const analysis = await analyzeNewsImpact(
          article.headline,
          article.summary,
          etfList.slice(0, 30)
        );
        
        if (analysis) {
          // Note: Firebase doesn't have an update method like Sequelize
          // You would need to implement an updateNews method in firebaseDataService
          // For now, we'll skip the update
          console.log('News impact analysis:', analysis);
        }
      }
    }
    
    console.log('Finnhub news update completed');
  } catch (error) {
    console.error('Error in Finnhub news service:', error);
  }
}

// GPT를 사용한 뉴스 관련성 분석
async function analyzeNewsRelevance(headline, summary) {
  try {
    const OpenAI = require('openai');
    const apiKey = functions.config().openai?.api_key || process.env.OPENAI_API_KEY || 'placeholder';
    const openai = new OpenAI({ apiKey });
    
    const prompt = `Analyze if this news is relevant to ETF investors and financial markets.
    
    Headline: ${headline}
    Summary: ${summary || 'No summary available'}
    
    Is this news relevant to ETF investors? Answer with only "true" or "false".
    Consider: market movements, economic indicators, company earnings, policy changes, commodity prices.
    Exclude: sports, entertainment, food, travel, crime, weather (unless market-impacting).`;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 10
    });
    
    const response = completion.choices[0].message.content.toLowerCase().trim();
    return response === 'true';
  } catch (error) {
    console.error('Error analyzing news relevance:', error);
    // 에러 시 보수적으로 포함
    return true;
  }
}

// 카테고리 결정
function determineCategory(headline, summary) {
  const text = `${headline} ${summary || ''}`.toLowerCase();
  
  if (text.includes('fed') || text.includes('inflation') || text.includes('interest rate') || 
      text.includes('gdp') || text.includes('unemployment') || text.includes('economic')) {
    return 'macro';
  } else if (text.includes('earnings') || text.includes('revenue') || text.includes('profit') || 
             text.includes('company') || text.includes('stock')) {
    return 'micro';
  } else if (text.includes('gold') || text.includes('oil') || text.includes('commodity') || 
             text.includes('crude') || text.includes('metal')) {
    return 'commodity';
  } else {
    return 'market';
  }
}

// WebSocket 연결 (실시간 데이터)
let ws = null;

function connectWebSocket() {
  if (ws) {
    ws.close();
  }
  
  ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);
  
  ws.on('open', () => {
    console.log('Finnhub WebSocket connected');
    
    // ETF 심볼 구독
    ETF_SYMBOLS.forEach(symbol => {
      ws.send(JSON.stringify({ 'type': 'subscribe', 'symbol': symbol }));
    });
  });
  
  ws.on('message', async (data) => {
    const message = JSON.parse(data);
    
    if (message.type === 'trade' && message.data) {
      for (const trade of message.data) {
        // 실시간 가격 업데이트
        await firebaseData.saveMarketData(trade.s, {
          price: trade.p,
          volume: trade.v,
          lastUpdated: new Date(trade.t)
        });
      }
    }
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  
  ws.on('close', () => {
    console.log('WebSocket disconnected. Reconnecting in 5 seconds...');
    setTimeout(connectWebSocket, 5000);
  });
}

// WebSocket 연결 종료
function disconnectWebSocket() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

// Export wrapper for newsService.js compatibility
async function fetchCompanyNews() {
  try {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fromDate = weekAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];
    
    // Get news for major ETFs
    const spyNews = await getCompanyNews('SPY', fromDate, toDate);
    const qqqNews = await getCompanyNews('QQQ', fromDate, toDate);
    
    return [...spyNews, ...qqqNews];
  } catch (error) {
    console.error('Error fetching company news:', error);
    return [];
  }
}

module.exports = {
  updateAllETFData,
  fetchAndAnalyzeFinnhubNews,
  fetchCompanyNews,
  connectWebSocket,
  disconnectWebSocket,
  getETFProfile,
  getQuote,
  getCompanyNews,
  getMarketNews,
  getETFHoldings
};