const { News, MarketData } = require('../models');
const { analyzeNewsImpact } = require('../services/aiService');

async function analyzeExistingNews() {
  try {
    console.log('Analyzing existing news with AI...');
    
    // Get ETF list
    const etfList = await MarketData.findAll({
      where: { type: 'ETF' },
      attributes: ['symbol', 'name'],
      limit: 20
    });
    
    // Get news without AI analysis
    const newsToAnalyze = await News.findAll({
      where: {
        impactedETFs: null
      },
      limit: 10,
      order: [['publishedAt', 'DESC']]
    });
    
    console.log(`Found ${newsToAnalyze.length} news items to analyze`);
    
    for (const news of newsToAnalyze) {
      try {
        console.log(`Analyzing: ${news.title.substring(0, 50)}...`);
        
        const analysis = await analyzeNewsImpact(
          news.title,
          news.summary,
          etfList
        );
        
        if (analysis) {
          await news.update({
            impactedETFs: analysis.impactedETFs,
            impactAnalysis: analysis.summary
          });
          console.log(`✓ Analyzed and updated news ID ${news.id}`);
        }
        
        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to analyze news ID ${news.id}:`, error.message);
      }
    }
    
    console.log('Analysis complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

analyzeExistingNews();