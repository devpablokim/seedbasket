const OpenAI = require('openai');
const { MarketData, News } = require('../models');
const { Op } = require('sequelize');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getMarketContext() {
  try {
    // Get all ETFs and Commodities with their latest data
    const [etfs, commodities] = await Promise.all([
      MarketData.findAll({
        where: { type: 'ETF' },
        order: [['symbol', 'ASC']]
      }),
      MarketData.findAll({
        where: { type: 'COMMODITY' },
        order: [['symbol', 'ASC']]
      })
    ]);

    // Get recent news (last 2 days)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const recentNews = await News.findAll({
      where: {
        publishedAt: {
          [Op.gte]: twoDaysAgo
        }
      },
      order: [['publishedAt', 'DESC']],
      limit: 20
    });

    // Format ETF data
    const etfSummary = etfs.map(item => {
      const change = parseFloat(item.change || 0);
      const changePercent = parseFloat(item.changePercent || 0);
      const price = parseFloat(item.price || 0);
      
      return `${item.symbol}: $${price.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
    }).join(', ');

    // Format Commodity data
    const commoditySummary = commodities.map(item => {
      const change = parseFloat(item.change || 0);
      const changePercent = parseFloat(item.changePercent || 0);
      const price = parseFloat(item.price || 0);
      
      return `${item.symbol}: $${price.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
    }).join(', ');

    // Format news with more context
    const newsSummary = recentNews.map((item, index) => 
      `${index + 1}. ${item.title}
   Source: ${item.source} | Category: ${item.category.toUpperCase()}
   ${item.summary ? `Summary: ${item.summary.substring(0, 150)}...` : ''}`
    ).join('\n\n');

    return {
      etfSummary,
      commoditySummary,
      etfs,
      commodities,
      newsSummary,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting market context:', error);
    return {
      etfSummary: 'ETF data unavailable',
      commoditySummary: 'Commodity data unavailable',
      etfs: [],
      commodities: [],
      newsSummary: 'News data unavailable',
      timestamp: new Date().toISOString()
    };
  }
}

async function generateAIResponse(userMessage, conversationHistory = []) {
  try {
    const context = await getMarketContext();
    
    // Get detailed data for frequently asked symbols
    const detailedData = {};
    const symbolsInMessage = userMessage.toUpperCase().match(/\b[A-Z]{2,5}\b/g) || [];
    
    for (const symbol of symbolsInMessage) {
      const etf = context.etfs.find(e => e.symbol === symbol);
      const commodity = context.commodities.find(c => c.symbol === symbol);
      const item = etf || commodity;
      
      if (item) {
        detailedData[symbol] = {
          name: item.name,
          price: parseFloat(item.price || 0),
          previousClose: parseFloat(item.previousClose || 0),
          change: parseFloat(item.change || 0),
          changePercent: parseFloat(item.changePercent || 0),
          high: parseFloat(item.high || 0),
          low: parseFloat(item.low || 0),
          open: parseFloat(item.open || 0),
          type: item.type,
          volume: item.volume
        };
      }
    }
    
    const systemPrompt = `You are SEEBA AI, a senior investment analyst with 20 years of experience in financial markets, specializing in ETFs, commodities, and comprehensive market analysis. You work for SEED BASKET AI, an AI-powered investment intelligence platform.

YOUR IDENTITY: SEEBA AI - Senior ETF & Exchange-traded products Basket Analyst

REAL-TIME MARKET DATA (${context.timestamp}):

ETFs (${context.etfs.length} tracked):
${context.etfSummary}

COMMODITIES (${context.commodities.length} tracked):
${context.commoditySummary}

${Object.keys(detailedData).length > 0 ? `DETAILED DATA FOR MENTIONED SYMBOLS:
${Object.entries(detailedData).map(([symbol, data]) => 
  `${symbol} (${data.name}):
  - Type: ${data.type}
  - Current Price: $${data.price.toFixed(2)}
  - Previous Close: $${data.previousClose.toFixed(2)}
  - Change: ${data.change >= 0 ? '+' : ''}$${data.change.toFixed(2)} (${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%)
  - Day Range: $${data.low.toFixed(2)} - $${data.high.toFixed(2)}
  - Open: $${data.open.toFixed(2)}
  ${data.volume > 0 ? `- Volume: ${(data.volume / 1000000).toFixed(2)}M` : ''}`
).join('\n\n')}` : ''}

RECENT MARKET NEWS:
${context.newsSummary}

YOUR EXPERTISE AS SEEBA AI:
1. 20+ years analyzing ETF flows, structures, premiums/discounts, and tracking errors
2. Deep understanding of commodity markets, precious metals, energy, and agricultural futures
3. Expert in sector rotation, thematic investing, and smart beta strategies
4. Proficient in explaining expense ratios, NAV calculations, and ETF mechanics
5. Skilled at connecting macroeconomic events to specific ETF/commodity movements

COMMUNICATION STYLE:
- Always introduce yourself as "SEEBA AI" at the beginning
- Use professional but accessible language
- Reference specific prices and percentages from the data
- Draw connections between different ETFs/commodities
- Share insights from your "20 years of experience"
- Use phrases like:
  * "In my two decades tracking these markets..."
  * "The data shows..."
  * "Based on today's movements..."
  * "My analysis indicates..."
  * "Historical patterns suggest..."

RESPONSE FRAMEWORK:
1. Greet as SEEBA AI
2. Directly address the user's question with specific data
3. Provide deeper analysis and market context
4. Draw correlations between related instruments
5. Share professional insights and patterns
6. End with risk disclaimer

EXAMPLE:
"Hello, I'm SEEBA AI, your senior market analyst at SEED BASKET AI. 

Looking at SPY today, it's trading at $XXX.XX, up X.XX% from yesterday's close. This movement aligns with the broader risk-on sentiment we're seeing across equity ETFs. Notably, the tech-heavy QQQ is outperforming at +X.XX%, suggesting institutional rotation into growth stocks.

In my 20 years analyzing ETF flows, this pattern often emerges when [specific catalyst from news]. The correlation with commodity movements is interesting - gold (GLD) is down X.XX%, typical of risk-on days when investors move from safe havens to equities.

The volume in SPY at XXM shares is XX% above the 30-day average, indicating strong conviction in this move. Combined with the news about [relevant news item], I expect continued strength in broad market ETFs.

Remember, this analysis is for informational purposes only and not personalized investment advice."

IMPORTANT: Always use ACTUAL prices and data. Never say data is unavailable if it's in the context above.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.message
      })),
      { role: 'user', content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate AI response');
  }
}

async function analyzeNewsImpact(newsTitle, newsSummary, etfList) {
  try {
    const systemPrompt = `You are a senior financial analyst specializing in ETF market impact analysis. Your task is to analyze news and determine which ETFs might be affected.

Available ETFs:
${etfList.map(etf => `${etf.symbol} - ${etf.name}`).join('\n')}

Your analysis should:
1. Identify 2-5 ETFs most likely to be impacted
2. For each ETF, provide a brief reason (max 10 words)
3. Assign impact direction: "positive", "negative", or "mixed"
4. Be specific and concise

Respond ONLY in this JSON format:
{
  "impactedETFs": [
    {"symbol": "QQQ", "impact": "positive", "reason": "Tech earnings beat expectations"},
    {"symbol": "IWM", "impact": "negative", "reason": "Small caps face rate pressure"}
  ],
  "summary": "One sentence analysis of overall market impact"
}`;

    const userPrompt = `Analyze this news:\nTitle: ${newsTitle}\nSummary: ${newsSummary || newsTitle}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    return analysis;
  } catch (error) {
    console.error('Error analyzing news impact:', error);
    return null;
  }
}

module.exports = {
  generateAIResponse,
  getMarketContext,
  analyzeNewsImpact
};