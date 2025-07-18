const OpenAI = require('openai');
const firebaseData = require('./firebaseDataService');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder'
});

async function getMarketContext() {
  try {
    // Get all ETFs and Commodities with their latest data
    const [etfs, commodities] = await Promise.all([
      firebaseData.getETFs(),
      firebaseData.getCommodities()
    ]);

    // Get recent news (last 2 days)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const recentNews = await firebaseData.getNews({
      startDate: twoDaysAgo,
      limit: 20
    });

    // Format market data for context
    const marketContext = {
      etfs: etfs.map(etf => ({
        symbol: etf.symbol,
        name: etf.name,
        price: etf.latestPrice,
        change: etf.change,
        changePercent: etf.changePercent,
        volume: etf.volume,
        marketCap: etf.marketCap
      })),
      commodities: commodities.map(commodity => ({
        symbol: commodity.symbol,
        name: commodity.name,
        price: commodity.latestPrice,
        change: commodity.change,
        changePercent: commodity.changePercent
      })),
      news: recentNews.slice(0, 10).map(article => ({
        title: article.title,
        summary: article.summary,
        sentiment: article.sentiment,
        source: article.source,
        publishedAt: article.publishedAt
      }))
    };

    return marketContext;
  } catch (error) {
    console.error('Error getting market context:', error);
    return null;
  }
}

async function generateAIResponse(message, conversationHistory = [], language = 'en') {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder') {
      throw new Error('OpenAI API key not configured');
    }

    // Get market context
    const marketContext = await getMarketContext();
    
    // Prepare system message based on language
    const systemMessages = {
      en: `You are SEEBA AI, an intelligent investment assistant. You provide helpful, accurate, and insightful investment advice and market analysis. You have access to real-time market data for ETFs and commodities, as well as recent financial news.

Current Market Context:
${marketContext ? JSON.stringify(marketContext, null, 2) : 'Market data temporarily unavailable'}

Guidelines:
- Provide clear, actionable investment insights
- Use the market data to support your analysis
- Be balanced in your recommendations
- Always remind users that this is not personalized financial advice
- Cite specific data points when relevant`,
      
      ko: `당신은 SEEBA AI, 지능형 투자 도우미입니다. 유용하고 정확하며 통찰력 있는 투자 조언과 시장 분석을 제공합니다. ETF와 원자재에 대한 실시간 시장 데이터와 최근 금융 뉴스에 접근할 수 있습니다.

현재 시장 상황:
${marketContext ? JSON.stringify(marketContext, null, 2) : '시장 데이터를 일시적으로 사용할 수 없습니다'}

가이드라인:
- 명확하고 실행 가능한 투자 인사이트 제공
- 분석을 뒷받침하기 위해 시장 데이터 활용
- 균형 잡힌 추천 제공
- 이것이 개인화된 금융 조언이 아님을 항상 상기시킴
- 관련이 있을 때 구체적인 데이터 포인트 인용`
    };

    // Build messages array
    const messages = [
      { role: 'system', content: systemMessages[language] || systemMessages.en }
    ];

    // Add conversation history
    conversationHistory.forEach(msg => {
      messages.push({ role: msg.role, content: msg.message });
    });

    // Add current message
    messages.push({ role: 'user', content: message });

    // Generate response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Provide language-specific error messages
    const errorMessages = {
      en: 'I apologize, but I\'m unable to process your request at the moment. Please try again later.',
      ko: '죄송합니다. 현재 요청을 처리할 수 없습니다. 나중에 다시 시도해 주세요.'
    };
    
    return errorMessages[language] || errorMessages.en;
  }
}

async function analyzeNewsWithSEEBA({ news, etfs, commodities, language = 'ko' }) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder') {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompts = {
      ko: `당신은 SEEBA AI, 전문 금융 뉴스 분석가입니다. 뉴스 기사를 분석하고 다음을 제공합니다:
1. 핵심 내용 요약 (2-3문장)
2. 영향을 받을 ETF/자산 및 예상 영향도
3. 투자자를 위한 실행 가능한 인사이트
4. 단기 및 장기 시장 영향 예측

현재 시장 데이터를 참고하여 구체적이고 실용적인 분석을 제공하세요.`,
      en: `You are SEEBA AI, an expert financial news analyst. Analyze news articles and provide:
1. Key points summary (2-3 sentences)
2. Affected ETFs/assets and expected impact
3. Actionable insights for investors
4. Short-term and long-term market impact predictions

Reference current market data to provide specific and practical analysis.`
    };

    const userPrompts = {
      ko: `다음 뉴스를 분석해주세요:

제목: ${news.title}
내용: ${news.summary || news.content}
출처: ${news.source}
발행일: ${news.publishedAt}

현재 주요 ETF 가격:
${etfs.slice(0, 10).map(etf => `${etf.symbol}: $${etf.latestPrice} (${etf.changePercent}%)`).join('\n')}

현재 주요 원자재 가격:
${commodities.slice(0, 5).map(c => `${c.symbol}: $${c.latestPrice} (${c.changePercent}%)`).join('\n')}`,
      en: `Analyze the following news:

Title: ${news.title}
Content: ${news.summary || news.content}
Source: ${news.source}
Published: ${news.publishedAt}

Current major ETF prices:
${etfs.slice(0, 10).map(etf => `${etf.symbol}: $${etf.latestPrice} (${etf.changePercent}%)`).join('\n')}

Current commodity prices:
${commodities.slice(0, 5).map(c => `${c.symbol}: $${c.latestPrice} (${c.changePercent}%)`).join('\n')}`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompts[language] || systemPrompts.ko },
        { role: 'user', content: userPrompts[language] || userPrompts.ko }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const analysis = completion.choices[0].message.content;

    // Parse the analysis to extract structured data
    const structuredAnalysis = {
      summary: analysis.split('\n')[0] || analysis,
      fullAnalysis: analysis,
      language: language,
      analyzedAt: new Date().toISOString()
    };

    return structuredAnalysis;
  } catch (error) {
    console.error('Error analyzing news with SEEBA:', error);
    
    const errorMessages = {
      ko: '뉴스 분석 중 오류가 발생했습니다.',
      en: 'Error occurred while analyzing the news.'
    };
    
    return {
      summary: errorMessages[language] || errorMessages.ko,
      fullAnalysis: errorMessages[language] || errorMessages.ko,
      language: language,
      analyzedAt: new Date().toISOString(),
      error: true
    };
  }
}

async function analyzeNewsImpact(title, content, etfList) {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder') {
      // Return a default analysis if OpenAI is not configured
      return {
        impactedETFs: [],
        summary: 'AI analysis not available'
      };
    }

    const prompt = `Analyze this news and identify which ETFs might be impacted:
Title: ${title}
Content: ${content}

ETFs to consider: ${etfList.slice(0, 10).map(etf => etf.symbol).join(', ')}

Provide:
1. List of impacted ETFs with impact type (positive/negative/mixed) and brief reason
2. One-sentence summary of overall market impact`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a financial analyst. Be concise and specific.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    // Parse the response
    const response = completion.choices[0].message.content;
    
    // Simple parsing - in production, use more robust parsing
    const impactedETFs = [];
    const lines = response.split('\n');
    
    lines.forEach(line => {
      const etfMatch = line.match(/(\w+).*?(positive|negative|mixed)/i);
      if (etfMatch) {
        impactedETFs.push({
          symbol: etfMatch[1],
          impact: etfMatch[2].toLowerCase(),
          reason: line.substring(line.indexOf(':') + 1).trim()
        });
      }
    });

    return {
      impactedETFs: impactedETFs.slice(0, 3),
      summary: lines[lines.length - 1] || 'Market impact analysis'
    };
  } catch (error) {
    console.error('Error analyzing news impact:', error);
    return {
      impactedETFs: [],
      summary: 'Analysis unavailable'
    };
  }
}

async function translateNews(text, targetLanguage = 'ko') {
  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder') {
      return text; // Return original text if OpenAI is not configured
    }

    const prompts = {
      ko: `Translate the following English news summary to Korean. Make it natural and fluent:

${text}`,
      en: `Translate the following Korean text to English. Make it natural and fluent:

${text}`
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a professional translator specializing in financial news.' },
        { role: 'user', content: prompts[targetLanguage] || prompts.ko }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error translating news:', error);
    return text; // Return original text on error
  }
}

module.exports = {
  generateAIResponse,
  analyzeNewsWithSEEBA,
  analyzeNewsImpact,
  translateNews
};