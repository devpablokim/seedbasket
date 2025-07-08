const OpenAI = require('openai');
const { MarketData, News } = require('../models');
const { Op } = require('sequelize');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getMarketContext() {
  try {
    // Get latest market data
    const marketData = await MarketData.findAll({
      order: [['lastUpdated', 'DESC']],
      limit: 30
    });

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
      limit: 15
    });

    // Format market data with more detail
    const marketSummary = marketData.map(item => {
      const change = parseFloat(item.change);
      const changePercent = parseFloat(item.changePercent);
      const price = parseFloat(item.price);
      const prevClose = parseFloat(item.previousClose);
      
      return `${item.symbol} (${item.name}):
  - Current Price: $${price.toFixed(2)}
  - Previous Close: $${prevClose.toFixed(2)}
  - Change: ${change >= 0 ? '+' : ''}$${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)
  - Type: ${item.type}`;
    }).join('\n\n');

    // Format news with more context
    const newsSummary = recentNews.map((item, index) => 
      `${index + 1}. ${item.title}
   Source: ${item.source} | Category: ${item.category.toUpperCase()}
   ${item.summary ? `Summary: ${item.summary.substring(0, 150)}...` : ''}`
    ).join('\n\n');

    return {
      marketSummary,
      newsSummary,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting market context:', error);
    return {
      marketSummary: 'Market data unavailable',
      newsSummary: 'News data unavailable',
      timestamp: new Date().toISOString()
    };
  }
}

async function generateAIResponse(userMessage, conversationHistory = []) {
  try {
    const context = await getMarketContext();
    
    const systemPrompt = `You are a senior investment analyst with 20 years of experience in financial markets, specializing in ETFs and market analysis. You work for SEED BASKET AI, an AI-powered investment intelligence platform.

TODAY'S MARKET DATA (${context.timestamp}):
${context.marketSummary}

TODAY'S FINANCIAL NEWS:
${context.newsSummary}

YOUR EXPERTISE AND APPROACH:
1. You have deep knowledge of market mechanics, ETF structures, and investment strategies.
2. When asked about price movements, ALWAYS cite the specific numbers from the data above.
3. Connect price movements to relevant news items when possible.
4. Provide professional analysis while explaining complex concepts clearly.
5. Draw from your "20 years of experience" to provide context and wisdom.
6. Use phrases like "In my experience...", "Based on today's data...", "Looking at the numbers..."
7. Always end with a disclaimer that this is not personalized financial advice.

EXAMPLE RESPONSE STYLE:
"Looking at today's data, QQQ is currently trading at $XXX.XX, up/down $X.XX (X.XX%) from yesterday's close of $XXX.XX. This movement appears to be driven by [specific news item from the list]. In my 20 years of experience, tech-heavy ETFs like QQQ often react strongly to [relevant factor]. The correlation with [other ETF] suggests [analysis]. Remember, this is market analysis and not personalized financial advice."

IMPORTANT: You must reference the ACTUAL PRICES and CHANGES from the data provided. Don't say you don't have access to the data - you do!`;

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