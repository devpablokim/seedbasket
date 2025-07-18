export const etfDescriptions = {
  // Core Market ETFs
  SPY: {
    name: "SPDR S&P 500 ETF",
    description: "Tracks the S&P 500 index, representing 500 largest US companies",
    holdings: "Apple, Microsoft, Amazon, Google, etc."
  },
  IVV: {
    name: "iShares Core S&P 500 ETF",
    description: "Low-cost exposure to large-cap US stocks",
    holdings: "S&P 500 companies"
  },
  VOO: {
    name: "Vanguard S&P 500 ETF",
    description: "Vanguard's S&P 500 tracker with ultra-low fees",
    holdings: "S&P 500 index components"
  },
  VTI: {
    name: "Vanguard Total Stock Market ETF",
    description: "Entire US stock market in one ETF",
    holdings: "4,000+ US stocks across all sizes"
  },
  QQQ: {
    name: "Invesco QQQ Trust",
    description: "Tracks the Nasdaq-100 index of largest non-financial companies",
    holdings: "Apple, Microsoft, Amazon, Meta, Tesla"
  },
  IWM: {
    name: "iShares Russell 2000 ETF",
    description: "Small-cap US companies tracker",
    holdings: "2,000 small-cap US stocks"
  },
  DIA: {
    name: "SPDR Dow Jones Industrial Average",
    description: "Tracks the famous Dow Jones 30 blue-chip stocks",
    holdings: "30 large industrial US companies"
  },
  
  // Sector ETFs
  XLF: {
    name: "Financial Select Sector SPDR",
    description: "US financial sector companies",
    holdings: "JPMorgan, Berkshire, Bank of America"
  },
  XLK: {
    name: "Technology Select Sector SPDR",
    description: "Technology and tech services companies",
    holdings: "Apple, Microsoft, NVIDIA"
  },
  XLE: {
    name: "Energy Select Sector SPDR",
    description: "Oil, gas, and energy companies",
    holdings: "Exxon, Chevron, ConocoPhillips"
  },
  XLV: {
    name: "Health Care Select Sector SPDR",
    description: "Healthcare and pharmaceutical companies",
    holdings: "UnitedHealth, Johnson & Johnson, Pfizer"
  },
  
  // International ETFs
  EFA: {
    name: "iShares MSCI EAFE ETF",
    description: "Developed markets outside US & Canada",
    holdings: "Europe, Asia, Far East stocks"
  },
  VWO: {
    name: "Vanguard Emerging Markets ETF",
    description: "Stocks from emerging market countries",
    holdings: "China, India, Brazil, Taiwan stocks"
  },
  EEM: {
    name: "iShares MSCI Emerging Markets ETF",
    description: "Large and mid-cap emerging market stocks",
    holdings: "Samsung, Taiwan Semi, Tencent"
  },
  
  // Fixed Income ETFs
  AGG: {
    name: "iShares Core US Aggregate Bond ETF",
    description: "Broad US investment-grade bond market",
    holdings: "US Treasury, corporate, mortgage bonds"
  },
  TLT: {
    name: "iShares 20+ Year Treasury Bond ETF",
    description: "Long-term US government bonds",
    holdings: "US Treasury bonds 20+ years"
  },
  HYG: {
    name: "iShares iBoxx High Yield Corporate Bond",
    description: "High-yield (junk) corporate bonds",
    holdings: "Below investment-grade corporate debt"
  },
  
  // Dividend ETFs
  VYM: {
    name: "Vanguard High Dividend Yield ETF",
    description: "High-dividend-yielding US companies",
    holdings: "JPMorgan, ExxonMobil, Johnson & Johnson"
  },
  SCHD: {
    name: "Schwab US Dividend Equity ETF",
    description: "High-quality dividend-paying US stocks",
    holdings: "Quality dividend stocks with growth"
  },
  
  // Commodities
  GLD: {
    name: "SPDR Gold Shares",
    description: "Physical gold bullion tracker",
    holdings: "Physical gold stored in vaults"
  },
  SLV: {
    name: "iShares Silver Trust",
    description: "Physical silver bullion tracker",
    holdings: "Physical silver in secure vaults"
  },
  USO: {
    name: "United States Oil Fund",
    description: "Tracks WTI crude oil futures",
    holdings: "Near-month crude oil futures"
  },
  UNG: {
    name: "United States Natural Gas Fund",
    description: "Natural gas futures tracker",
    holdings: "Natural gas futures contracts"
  },
  DBA: {
    name: "Invesco DB Agriculture Fund",
    description: "Basket of agricultural commodities",
    holdings: "Corn, wheat, soybeans, sugar futures"
  },
  CORN: {
    name: "Teucrium Corn Fund",
    description: "Corn futures tracker",
    holdings: "Corn futures contracts"
  },
  WEAT: {
    name: "Teucrium Wheat Fund",
    description: "Wheat futures tracker",
    holdings: "Wheat futures contracts"
  },
  CPER: {
    name: "United States Copper Index Fund",
    description: "Copper futures tracker",
    holdings: "Copper futures contracts"
  },
  
  // More ETFs
  MDY: {
    name: "SPDR S&P MidCap 400 ETF",
    description: "Mid-cap US companies tracker",
    holdings: "400 mid-cap US stocks"
  },
  RSP: {
    name: "Invesco S&P 500 Equal Weight ETF",
    description: "S&P 500 with equal weighting to all stocks",
    holdings: "S&P 500 stocks, equally weighted"
  },
  SPLG: {
    name: "SPDR Portfolio S&P 500 ETF",
    description: "Low-cost S&P 500 tracker",
    holdings: "S&P 500 index components"
  },
  
  // More Sector ETFs
  XLI: {
    name: "Industrial Select Sector SPDR",
    description: "Industrial sector companies",
    holdings: "Boeing, Honeywell, Union Pacific"
  },
  XLY: {
    name: "Consumer Discretionary Select SPDR",
    description: "Consumer discretionary companies",
    holdings: "Amazon, Tesla, Home Depot"
  },
  XLP: {
    name: "Consumer Staples Select SPDR",
    description: "Consumer staples companies",
    holdings: "Procter & Gamble, Coca-Cola, Walmart"
  },
  XLB: {
    name: "Materials Select Sector SPDR",
    description: "Materials and chemicals companies",
    holdings: "Linde, Sherwin-Williams, Air Products"
  },
  XLRE: {
    name: "Real Estate Select Sector SPDR",
    description: "Real estate investment trusts",
    holdings: "American Tower, Prologis, Crown Castle"
  },
  XLU: {
    name: "Utilities Select Sector SPDR",
    description: "Utility companies",
    holdings: "NextEra Energy, Southern Company"
  },
  
  // International ETFs
  VEA: {
    name: "Vanguard Developed Markets ETF",
    description: "International developed markets",
    holdings: "Europe, Pacific, Canada stocks"
  },
  IEFA: {
    name: "iShares Core MSCI EAFE ETF",
    description: "Core international developed equity",
    holdings: "International developed markets"
  },
  IEMG: {
    name: "iShares Core MSCI Emerging Markets ETF",
    description: "Core emerging markets exposure",
    holdings: "China, India, Brazil, Taiwan"
  },
  FXI: {
    name: "iShares China Large-Cap ETF",
    description: "Chinese large-cap stocks",
    holdings: "Alibaba, Tencent, Meituan"
  },
  EWZ: {
    name: "iShares MSCI Brazil ETF",
    description: "Brazilian stock market",
    holdings: "Petrobras, Vale, Itau Unibanco"
  },
  EWJ: {
    name: "iShares MSCI Japan ETF",
    description: "Japanese stock market",
    holdings: "Toyota, Sony, Softbank"
  },
  INDA: {
    name: "iShares MSCI India ETF",
    description: "Indian stock market exposure",
    holdings: "Reliance, Infosys, HDFC Bank"
  },
  
  // Growth/Value ETFs
  VUG: {
    name: "Vanguard Growth ETF",
    description: "Large-cap growth stocks",
    holdings: "Tech giants and growth companies"
  },
  VTV: {
    name: "Vanguard Value ETF",
    description: "Large-cap value stocks",
    holdings: "Undervalued large companies"
  },
  IWF: {
    name: "iShares Russell 1000 Growth ETF",
    description: "Large-cap growth companies",
    holdings: "1000 largest growth stocks"
  },
  IWD: {
    name: "iShares Russell 1000 Value ETF",
    description: "Large-cap value companies",
    holdings: "1000 largest value stocks"
  },
  VBR: {
    name: "Vanguard Small-Cap Value ETF",
    description: "Small-cap value stocks",
    holdings: "Undervalued small companies"
  },
  VBK: {
    name: "Vanguard Small-Cap Growth ETF",
    description: "Small-cap growth stocks",
    holdings: "High-growth small companies"
  },
  SCHG: {
    name: "Schwab US Large-Cap Growth ETF",
    description: "Large-cap growth focus",
    holdings: "Growth-oriented large caps"
  },
  SCHV: {
    name: "Schwab US Large-Cap Value ETF",
    description: "Large-cap value focus",
    holdings: "Value-oriented large caps"
  },
  
  // Innovation ETFs
  ARKK: {
    name: "ARK Innovation ETF",
    description: "Disruptive innovation companies",
    holdings: "Tesla, Roku, Zoom, Coinbase"
  },
  ARKG: {
    name: "ARK Genomic Revolution ETF",
    description: "Genomics and biotech innovation",
    holdings: "CRISPR, Exact Sciences, Teladoc"
  },
  ARKQ: {
    name: "ARK Autonomous Tech & Robotics ETF",
    description: "Automation and robotics",
    holdings: "Tesla, Trimble, Kratos Defense"
  },
  ARKW: {
    name: "ARK Next Generation Internet ETF",
    description: "Internet and cloud computing",
    holdings: "Tesla, Coinbase, Shopify, Block"
  },
  ARKF: {
    name: "ARK Fintech Innovation ETF",
    description: "Financial technology innovation",
    holdings: "Block, Shopify, Coinbase"
  },
  
  // Clean Energy ETFs
  ICLN: {
    name: "iShares Global Clean Energy ETF",
    description: "Global clean energy companies",
    holdings: "Renewable energy producers"
  },
  TAN: {
    name: "Invesco Solar ETF",
    description: "Solar energy companies",
    holdings: "First Solar, Enphase, SolarEdge"
  },
  LIT: {
    name: "Global X Lithium & Battery Tech ETF",
    description: "Lithium and battery technology",
    holdings: "Albemarle, Tesla, BYD"
  },
  
  // Tech ETFs
  HACK: {
    name: "ETFMG Prime Cyber Security ETF",
    description: "Cybersecurity companies",
    holdings: "CrowdStrike, Palo Alto, Fortinet"
  },
  ROBO: {
    name: "ROBO Global Robotics & Automation ETF",
    description: "Robotics and automation",
    holdings: "Intuitive Surgical, ABB, Fanuc"
  },
  
  // More Dividend ETFs
  DVY: {
    name: "iShares Select Dividend ETF",
    description: "High-dividend US stocks",
    holdings: "Utilities, REITs, Financials"
  },
  VIG: {
    name: "Vanguard Dividend Appreciation ETF",
    description: "Dividend growth companies",
    holdings: "Microsoft, Apple, UnitedHealth"
  },
  SDY: {
    name: "SPDR S&P Dividend ETF",
    description: "Dividend aristocrats",
    holdings: "Companies raising dividends 20+ years"
  },
  HDV: {
    name: "iShares Core High Dividend ETF",
    description: "Quality dividend payers",
    holdings: "Energy, Healthcare dividend stocks"
  },
  DGRO: {
    name: "iShares Core Dividend Growth ETF",
    description: "Growing dividend companies",
    holdings: "Companies with dividend growth"
  },
  DGRW: {
    name: "WisdomTree US Quality Dividend Growth",
    description: "Quality dividend growers",
    holdings: "High-quality dividend growth stocks"
  },
  NOBL: {
    name: "ProShares S&P 500 Dividend Aristocrats",
    description: "25+ years dividend increasers",
    holdings: "S&P 500 dividend aristocrats"
  },
  SPHD: {
    name: "Invesco S&P 500 High Dividend Low Vol",
    description: "High dividend, low volatility",
    holdings: "Stable high-yield stocks"
  },
  
  // Fixed Income ETFs
  BND: {
    name: "Vanguard Total Bond Market ETF",
    description: "Entire US bond market",
    holdings: "Government and corporate bonds"
  },
  LQD: {
    name: "iShares iBoxx Investment Grade Corp Bond",
    description: "Investment grade corporate bonds",
    holdings: "High-quality corporate debt"
  },
  IEF: {
    name: "iShares 7-10 Year Treasury Bond ETF",
    description: "Intermediate-term US Treasuries",
    holdings: "7-10 year government bonds"
  },
  SHY: {
    name: "iShares 1-3 Year Treasury Bond ETF",
    description: "Short-term US Treasuries",
    holdings: "1-3 year government bonds"
  },
  TIP: {
    name: "iShares TIPS Bond ETF",
    description: "Inflation-protected Treasury bonds",
    holdings: "US Treasury inflation-protected securities"
  },
  MUB: {
    name: "iShares National Muni Bond ETF",
    description: "Tax-free municipal bonds",
    holdings: "US municipal bonds"
  },
  EMB: {
    name: "iShares Emerging Markets Bond ETF",
    description: "Emerging market government bonds",
    holdings: "EM sovereign debt"
  },
  
  // More Commodities
  IAU: {
    name: "iShares Gold Trust",
    description: "Physical gold bullion",
    holdings: "Gold bars in secure vaults"
  },
  PPLT: {
    name: "abrdn Platinum ETF",
    description: "Physical platinum tracker",
    holdings: "Platinum bullion"
  },
  PALL: {
    name: "abrdn Palladium ETF",
    description: "Physical palladium tracker",
    holdings: "Palladium bullion"
  },
  BNO: {
    name: "United States Brent Oil Fund",
    description: "Brent crude oil futures",
    holdings: "Brent oil futures contracts"
  },
  UCO: {
    name: "ProShares Ultra Bloomberg Crude Oil",
    description: "2x leveraged crude oil",
    holdings: "Leveraged oil futures"
  },
  SOYB: {
    name: "Teucrium Soybean Fund",
    description: "Soybean futures tracker",
    holdings: "Soybean futures contracts"
  },
  CANE: {
    name: "Teucrium Sugar Fund",
    description: "Sugar futures tracker",
    holdings: "Sugar futures contracts"
  },
  DBB: {
    name: "Invesco DB Base Metals Fund",
    description: "Industrial metals basket",
    holdings: "Aluminum, Zinc, Copper futures"
  },
  JJC: {
    name: "iPath Bloomberg Copper ETN",
    description: "Copper futures exposure",
    holdings: "Copper futures contracts"
  }
};

// Korean translations
export const etfDescriptionsKo = {
  // Core Market ETFs
  SPY: {
    name: "SPDR S&P 500 ETF",
    description: "미국 500대 대기업을 추적하는 S&P 500 지수",
    holdings: "애플, 마이크로소프트, 아마존, 구글 등"
  },
  IVV: {
    name: "아이셰어즈 코어 S&P 500 ETF",
    description: "저비용으로 미국 대형주에 투자",
    holdings: "S&P 500 기업들"
  },
  VOO: {
    name: "뱅가드 S&P 500 ETF",
    description: "초저비용 S&P 500 추적 ETF",
    holdings: "S&P 500 지수 구성종목"
  },
  VTI: {
    name: "뱅가드 토탈 스톡 마켓 ETF",
    description: "미국 전체 주식시장을 하나의 ETF로",
    holdings: "4,000개 이상의 미국 주식"
  },
  QQQ: {
    name: "인베스코 QQQ 트러스트",
    description: "나스닥 100 지수의 대형 기술주 추적",
    holdings: "애플, 마이크로소프트, 아마존, 메타, 테슬라"
  },
  IWM: {
    name: "아이셰어즈 러셀 2000 ETF",
    description: "미국 소형주 추적",
    holdings: "2,000개 소형주"
  },
  DIA: {
    name: "SPDR 다우존스 산업평균",
    description: "다우존스 30대 우량주 추적",
    holdings: "30개 대형 산업주"
  },
  
  // Sector ETFs
  XLF: {
    name: "금융 섹터 SPDR",
    description: "미국 금융 섹터 기업",
    holdings: "JP모건, 버크셔해서웨이, 뱅크오브아메리카"
  },
  XLK: {
    name: "기술 섹터 SPDR",
    description: "기술 및 기술 서비스 기업",
    holdings: "애플, 마이크로소프트, 엔비디아"
  },
  XLE: {
    name: "에너지 섹터 SPDR",
    description: "석유, 가스, 에너지 기업",
    holdings: "엑손모빌, 셰브론, 코노코필립스"
  },
  XLV: {
    name: "헬스케어 섹터 SPDR",
    description: "의료 및 제약 기업",
    holdings: "유나이티드헬스, 존슨앤존슨, 화이자"
  },
  
  // International ETFs
  EFA: {
    name: "아이셰어즈 MSCI EAFE ETF",
    description: "미국/캐나다 제외 선진국 시장",
    holdings: "유럽, 아시아, 극동 주식"
  },
  VWO: {
    name: "뱅가드 이머징 마켓 ETF",
    description: "신흥시장 국가 주식",
    holdings: "중국, 인도, 브라질, 대만 주식"
  },
  EEM: {
    name: "아이셰어즈 MSCI 이머징 마켓 ETF",
    description: "신흥시장 대형/중형주",
    holdings: "삼성전자, TSMC, 텐센트"
  },
  
  // Commodities
  GLD: {
    name: "SPDR 골드 셰어",
    description: "실물 금 보유 ETF",
    holdings: "금고에 보관된 실물 금"
  },
  SLV: {
    name: "아이셰어즈 실버 트러스트",
    description: "실물 은 보유 ETF",
    holdings: "안전한 금고에 보관된 실물 은"
  },
  USO: {
    name: "미국 원유 펀드",
    description: "WTI 원유 선물 추적",
    holdings: "근월물 원유 선물 계약"
  },
  UNG: {
    name: "미국 천연가스 펀드",
    description: "천연가스 선물 추적",
    holdings: "천연가스 선물 계약"
  },
  DBA: {
    name: "인베스코 DB 농업 펀드",
    description: "농산물 바스켓",
    holdings: "옥수수, 밀, 대두, 설탕 선물"
  },
  
  // Dividend ETFs
  VYM: {
    name: "뱅가드 고배당 수익률 ETF",
    description: "고배당 미국 기업",
    holdings: "JP모건, 엑손모빌, 존슨앤존슨"
  },
  SCHD: {
    name: "슈왑 미국 배당주 ETF",
    description: "고품질 배당주",
    holdings: "성장성 있는 우량 배당주"
  },
  
  // Fixed Income
  AGG: {
    name: "아이셰어즈 코어 미국 종합채권 ETF",
    description: "미국 투자등급 채권시장 전체",
    holdings: "미국 국채, 회사채, 모기지채"
  },
  TLT: {
    name: "아이셰어즈 20년+ 미국채 ETF",
    description: "장기 미국 국채",
    holdings: "20년 이상 미국 국채"
  },
  HYG: {
    name: "아이셰어즈 하이일드 회사채",
    description: "고수익(정크) 회사채",
    holdings: "투자등급 미만 회사채"
  },
  
  // Innovation ETFs
  ARKK: {
    name: "ARK 이노베이션 ETF",
    description: "파괴적 혁신 기업",
    holdings: "테슬라, 로쿠, 줌, 코인베이스"
  },
  ARKG: {
    name: "ARK 유전체 혁명 ETF",
    description: "유전체학 및 바이오테크 혁신",
    holdings: "크리스퍼, 엑잭트사이언스, 텔라닥"
  },
  
  // Clean Energy
  ICLN: {
    name: "아이셰어즈 글로벌 청정에너지 ETF",
    description: "글로벌 청정에너지 기업",
    holdings: "재생에너지 생산업체"
  },
  TAN: {
    name: "인베스코 솔라 ETF",
    description: "태양광 에너지 기업",
    holdings: "퍼스트솔라, 엔페이즈, 솔라엣지"
  },
  LIT: {
    name: "글로벌X 리튬&배터리 기술 ETF",
    description: "리튬 및 배터리 기술",
    holdings: "알버말, 테슬라, BYD"
  }
};