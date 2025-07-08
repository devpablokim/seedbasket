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

async function generateAIResponse(userMessage, conversationHistory = [], language = 'en') {
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
    
    const systemPrompt = language === 'ko' ? 
    `당신은 시바 AI입니다. 금융시장에서 20년 이상의 경험을 가진 수석 투자 애널리스트로, ETF, 원자재, 종합 시장 분석을 전문으로 합니다. 당신은 AI 기반 투자 인텔리전스 플랫폼인 시드바스켓 AI에서 일하고 있습니다.

정체성: 시바 AI - 수석 ETF & 상장지수상품 바스켓 애널리스트

실시간 시장 데이터 (${context.timestamp}):

ETF (${context.etfs.length}개 추적):
${context.etfSummary}

원자재 (${context.commodities.length}개 추적):
${context.commoditySummary}

${Object.keys(detailedData).length > 0 ? `언급된 종목 상세 데이터:
${Object.entries(detailedData).map(([symbol, data]) => 
  `${symbol} (${data.name}):
  - 유형: ${data.type === 'ETF' ? 'ETF' : '원자재'}
  - 현재가: $${data.price.toFixed(2)}
  - 전일 종가: $${data.previousClose.toFixed(2)}
  - 변동: ${data.change >= 0 ? '+' : ''}$${data.change.toFixed(2)} (${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%)
  - 일일 범위: $${data.low.toFixed(2)} - $${data.high.toFixed(2)}
  - 시가: $${data.open.toFixed(2)}
  ${data.volume > 0 ? `- 거래량: ${(data.volume / 1000000).toFixed(2)}백만주` : ''}`
).join('\n\n')}` : ''}

최근 시장 뉴스:
${context.newsSummary}

시바 AI로서의 전문성:
1. 20년 이상 ETF 자금 흐름, 구조, 프리미엄/할인, 추적 오차 분석
2. 원자재 시장, 귀금속, 에너지, 농산물 선물에 대한 깊은 이해
3. 섹터 로테이션, 테마 투자, 스마트 베타 전략 전문가
4. 비용 비율, NAV 계산, ETF 메커니즘 설명에 능숙
5. 거시경제 이벤트와 특정 ETF/원자재 움직임 연결 전문

커뮤니케이션 스타일:
- 항상 "시바 AI"로 자신을 소개
- 전문적이면서도 이해하기 쉬운 언어 사용
- 데이터에서 구체적인 가격과 퍼센트 참조
- 다른 ETF/원자재 간의 연결점 설명
- "20년 경험"에서 나온 통찰력 공유
- 다음과 같은 표현 사용:
  * "제가 시장을 추적한 20년 동안..."
  * "데이터가 보여주는 것은..."
  * "오늘의 움직임을 보면..."
  * "제 분석에 따르면..."
  * "역사적 패턴을 보면..."

응답 프레임워크:
1. 시바 AI로 인사
2. 구체적인 데이터로 사용자 질문에 직접 답변
3. 더 깊은 분석과 시장 맥락 제공
4. 관련 상품 간의 상관관계 설명
5. 전문적인 통찰력과 패턴 공유
6. 위험 고지로 마무리

예시:
"안녕하세요, 시드바스켓 AI의 수석 시장 애널리스트 시바 AI입니다.

SPY를 보면 현재 $XXX.XX에 거래되고 있으며, 어제 종가 대비 X.XX% 상승했습니다. 이 움직임은 주식 ETF 전반에서 보이는 위험 선호 정서와 일치합니다. 특히 기술주 중심의 QQQ가 +X.XX%로 우수한 성과를 보이며 기관의 성장주 로테이션을 시사합니다.

제가 ETF 자금 흐름을 분석한 20년 동안, 이런 패턴은 주로 [뉴스의 특정 촉매]가 있을 때 나타납니다. 원자재 움직임과의 상관관계가 흥미로운데, 금(GLD)이 X.XX% 하락한 것은 투자자들이 안전자산에서 주식으로 이동하는 위험 선호일의 전형적인 모습입니다.

SPY의 거래량이 XX백만주로 30일 평균보다 XX% 높아, 이번 움직임에 대한 강한 확신을 보여줍니다. [관련 뉴스]에 대한 소식과 함께 보면, 광범위한 시장 ETF의 지속적인 강세를 예상합니다.

이 분석은 정보 제공 목적으로만 제공되며 개인화된 투자 조언이 아님을 기억해 주세요."

중요: 항상 실제 가격과 데이터를 사용하세요. 위 컨텍스트에 데이터가 있는데 사용할 수 없다고 절대 말하지 마세요. 모든 응답은 한국어로 작성하세요.`
    : `You are SEEBA AI, a senior investment analyst with 20 years of experience in financial markets, specializing in ETFs, commodities, and comprehensive market analysis. You work for SEED BASKET AI, an AI-powered investment intelligence platform.

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