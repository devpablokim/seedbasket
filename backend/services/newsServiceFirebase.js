const axios = require('axios');
const firebaseData = require('./firebaseDataService');
const { analyzeNewsImpact } = require('./aiService');
const finnhubService = require('./finnhubService');

const NEWS_API_KEY = process.env.NEWSAPI_KEY;

async function fetchFromNewsAPI() {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'ETF OR commodity OR "stock market" OR economy OR inflation OR "federal reserve"',
        apiKey: NEWS_API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 30,
        from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    });

    return response.data.articles || [];
  } catch (error) {
    console.error('NewsAPI error:', error.response?.data || error.message);
    return [];
  }
}

function categorizeNews(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  
  if (text.includes('inflation') || text.includes('gdp') || text.includes('federal reserve') || 
      text.includes('interest rate') || text.includes('employment') || text.includes('economic')) {
    return 'macro';
  } else if (text.includes('earnings') || text.includes('revenue') || text.includes('profit') || 
             text.includes('company') || text.includes('corporate')) {
    return 'micro';
  } else if (text.includes('commodity') || text.includes('oil') || text.includes('gold') || 
             text.includes('agriculture') || text.includes('metal')) {
    return 'commodity';
  } else {
    return 'market';
  }
}

async function fetchLatestNews() {
  console.log('Fetching latest news for Firestore...');
  
  try {
    // Fetch from multiple sources
    const [newsAPIArticles, finnhubNews] = await Promise.all([
      fetchFromNewsAPI(),
      finnhubService.fetchCompanyNews()
    ]);
    
    // Get existing ETF data for AI analysis
    const etfList = await firebaseData.getETFs();
    
    const processedNews = [];
    
    // Process NewsAPI articles
    for (const article of newsAPIArticles) {
      try {
        const category = categorizeNews(article.title, article.description);
        
        // AI analysis for ETF impact
        const impactAnalysis = await analyzeNewsImpact(
          article.title,
          article.description || article.content,
          etfList
        );
        
        const newsData = {
          title: article.title,
          summary: article.description,
          content: article.content,
          url: article.url,
          source: article.source.name,
          category: category,
          publishedAt: new Date(article.publishedAt),
          imageUrl: article.urlToImage,
          sentiment: impactAnalysis?.impactedETFs?.[0]?.impact || 'neutral',
          impactedETFs: impactAnalysis?.impactedETFs || [],
          impactAnalysis: impactAnalysis?.summary || null
        };
        
        await firebaseData.saveNews(newsData);
        processedNews.push(newsData);
      } catch (error) {
        console.error('Error processing NewsAPI article:', error);
      }
    }
    
    // Process Finnhub news
    for (const article of finnhubNews) {
      try {
        const newsData = {
          title: article.headline,
          summary: article.summary,
          content: article.summary,
          url: article.url,
          source: article.source || 'Finnhub',
          category: article.category || 'market',
          publishedAt: new Date(article.datetime * 1000),
          imageUrl: article.image,
          sentiment: article.sentiment || 'neutral',
          impactedETFs: article.impactedETFs || [],
          impactAnalysis: article.impactAnalysis || null
        };
        
        await firebaseData.saveNews(newsData);
        processedNews.push(newsData);
      } catch (error) {
        console.error('Error processing Finnhub article:', error);
      }
    }
    
    // Cache the latest news
    await firebaseData.setCachedData('latest_news', processedNews);
    
    console.log('News update completed for Firestore');
  } catch (error) {
    console.error('Error fetching news:', error);
  }
}

module.exports = {
  fetchLatestNews,
  categorizeNews
};