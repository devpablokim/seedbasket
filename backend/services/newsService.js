const axios = require('axios');
const { News, MarketData } = require('../models');
const { analyzeNewsImpact } = require('./aiService');

async function fetchLatestNews() {
  try {
    console.log('Fetching latest news...');
    
    const apiKey = process.env.NEWSAPI_KEY;
    const categories = ['business'];
    const keywords = ['stock market', 'ETF', 'gold price', 'oil price', 'federal reserve', 'inflation', 'cryptocurrency', 'bitcoin', 'earnings'];
    
    // 1. Get top business headlines from multiple countries
    const countries = ['us', 'gb', 'ca', 'au'];
    for (const country of countries) {
      const url = `https://newsapi.org/v2/top-headlines?category=business&country=${country}&apiKey=${apiKey}`;
      
      try {
        const response = await axios.get(url);
        const articles = response.data.articles || [];
        
        for (const article of articles) {
          if (!article.url || !article.title) continue;
          
          // Filter out non-financial news
          if (!isFinanceRelated(article.title, article.description)) {
            continue;
          }
          
          const newsCategory = determineCategory(article.title, article.description);
          
          // First, create or update the news item
          const [newsItem, created] = await News.upsert({
            title: article.title,
            summary: article.description || article.content?.substring(0, 500),
            source: article.source.name,
            url: article.url,
            publishedAt: new Date(article.publishedAt),
            category: newsCategory
          });
          
          // If it's a new article, analyze its impact
          if (created && process.env.OPENAI_API_KEY) {
            try {
              const etfList = await MarketData.findAll({
                where: { type: 'ETF' },
                attributes: ['symbol', 'name'],
                limit: 20
              });
              
              const analysis = await analyzeNewsImpact(
                article.title,
                article.description,
                etfList
              );
              
              if (analysis) {
                await News.update({
                  impactedETFs: analysis.impactedETFs,
                  impactAnalysis: analysis.summary
                }, {
                  where: { id: newsItem.id }
                });
              }
            } catch (aiError) {
              console.error('AI analysis failed for news:', aiError);
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching business news from ${country}:`, error.message);
      }
    }
    
    console.log('News update completed');
  } catch (error) {
    console.error('Error in news service:', error);
  }
}

function isFinanceRelated(title, description) {
  const text = `${title} ${description || ''}`.toLowerCase();
  
  // Keywords that indicate finance-related content
  const financeKeywords = [
    'stock', 'market', 'trading', 'investor', 'investment', 'etf', 'fund',
    'earnings', 'revenue', 'profit', 'loss', 'ipo', 'merger', 'acquisition',
    'fed', 'federal reserve', 'inflation', 'interest rate', 'economy', 'gdp',
    'dow', 'nasdaq', 's&p', 'index', 'futures', 'options', 'bonds', 'treasury',
    'crypto', 'bitcoin', 'ethereum', 'blockchain', 'currency', 'forex', 'dollar',
    'oil', 'gold', 'silver', 'commodity', 'crude', 'natural gas',
    'bank', 'financial', 'wall street', 'sec', 'regulation', 'policy',
    'analyst', 'forecast', 'outlook', 'recession', 'growth', 'decline',
    'portfolio', 'asset', 'equity', 'debt', 'yield', 'dividend', 'valuation',
    'tech stock', 'tech giant', 'silicon valley', 'startup', 'venture'
  ];
  
  // Exclude keywords that indicate non-financial content
  const excludeKeywords = [
    'recipe', 'food', 'restaurant', 'bbq', 'barbecue', 'cooking', 'cuisine',
    'sport', 'game', 'player', 'team', 'championship', 'league', 'score',
    'movie', 'film', 'actor', 'actress', 'entertainment', 'celebrity',
    'fashion', 'style', 'clothing', 'design', 'beauty', 'makeup',
    'travel', 'vacation', 'tourist', 'destination', 'hotel', 'flight',
    'weather', 'storm', 'temperature', 'forecast', 'climate',
    'crime', 'police', 'arrest', 'court', 'trial', 'sentence',
    'health', 'medical', 'doctor', 'hospital', 'disease', 'treatment'
  ];
  
  // Check for exclude keywords first
  for (const keyword of excludeKeywords) {
    if (text.includes(keyword)) {
      return false;
    }
  }
  
  // Check for finance keywords
  for (const keyword of financeKeywords) {
    if (text.includes(keyword)) {
      return true;
    }
  }
  
  return false;
}

function determineCategory(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('fed') || text.includes('inflation') || text.includes('interest rate')) {
    return 'macro';
  } else if (text.includes('earnings') || text.includes('company')) {
    return 'micro';
  } else if (text.includes('gold') || text.includes('oil') || text.includes('commodity')) {
    return 'commodity';
  } else {
    return 'market';
  }
}

module.exports = {
  fetchLatestNews
};