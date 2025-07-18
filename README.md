# SEED BASKET AI 🌱

🌐 **Live**: [https://seedbasket.ai](https://seedbasket.ai)

AI-powered personalized investment assistant platform. Provides real-time market data, investment diary, and AI news analysis.

AI 기반 개인 맞춤형 투자 도우미 플랫폼입니다. 실시간 시장 데이터, 투자 일기, AI 뉴스 분석을 제공합니다.

## Key Features / 주요 기능

- 📊 **Real-time Market Data / 실시간 시장 데이터**: Track ETFs and commodities prices in real-time
- 📖 **Investment Diary / 투자 일기**: Document your investment journey with portfolio tracking
- 📰 **AI News Analysis / AI 뉴스 분석**: Market news with ETF impact predictions
- 🤖 **SEEBA AI / SEEBA AI**: AI investment advice with real-time market data access
- ⏰ **Market Clock / 시장 시계**: Track US market open/close times
- 🔐 **Authentication / 인증**: Firebase Auth (Email/Password, Google Login)
- 🌐 **Multi-language / 다국어**: English and Korean support

## Tech Stack / 기술 스택

### Frontend
- **Framework**: React 18
- **UI**: Material-UI, Tailwind CSS
- **차트**: Recharts, Chart.js
- **인증**: Firebase Auth SDK

### Backend (Serverless)
- **런타임**: Firebase Functions
- **API**: Express.js
- **인증**: Firebase Admin SDK

### Infrastructure / 인프라
- **Hosting / 호스팅**: Firebase Hosting (Custom domain: seedbasket.ai)
- **Database / 데이터베이스**: Firestore
- **Storage / 파일 저장**: Firebase Storage
- **CI/CD**: GitHub Actions

### External APIs / 외부 API
- **Market Data / 시장 데이터**: Finnhub API
- **AI**: OpenAI GPT-4
- **News / 뉴스**: Finnhub News API

## Project Structure / 프로젝트 구조

```
seedbasket/
├── frontend/          # React app
├── backend/           # Express server (Development)
├── functions/         # Firebase Functions (Production)
├── .github/           # GitHub Actions workflows
├── firebase.json      # Firebase configuration
├── firestore.rules    # Firestore security rules
└── firestore.indexes.json # Firestore indexes
```

## Development Setup / 개발 환경 설정

### Prerequisites
- Node.js (v16+)
- Firebase CLI
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/seedbasket.git
cd seedbasket
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Functions
cd ../functions
npm install
```

3. Set up environment variables:

Create `.env` file in backend directory:
```env
PORT=5002
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d

# API Keys
FINNHUB_API_KEY=your-finnhub-key
NEWSAPI_KEY=your-newsapi-key
OPENAI_API_KEY=your-openai-key
```

4. Start development servers:
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory) 
npm start
```

The application will be available at:
- Frontend: http://localhost:3456
- Backend API: http://localhost:5002

## Deployment / 배포

The application is deployed on Firebase:

```bash
# Deploy functions
firebase deploy --only functions

# Deploy hosting
cd frontend
npm run build
firebase deploy --only hosting
```

## Environment Configuration / 환경 설정

- **Development**: Uses local Express server (backend/)
- **Production**: Uses Firebase Functions (functions/)

Environment switching is automatic based on NODE_ENV.

## License

MIT

## 로컬 개발 환경 설정

### 사전 요구사항
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- Git

### 설치

1. 저장소 클론:
```bash
git clone https://github.com/yourusername/seedbasket.git
cd seedbasket
```

2. Frontend 의존성 설치:
```bash
cd frontend
npm install
```

3. Functions 의존성 설치:
```bash
cd ../functions
npm install
```

4. 환경 변수 설정:
```bash
# Functions 환경 변수
firebase functions:config:set \
  finnhub.api_key="YOUR_FINNHUB_KEY" \
  openai.api_key="YOUR_OPENAI_KEY"
```

5. 로컬 실행:
```bash
# Firebase 에뮬레이터 시작
firebase emulators:start

# 다른 터미널에서 프론트엔드 시작
cd frontend
npm start
```

## 배포

### 자동 배포 (GitHub Actions)
main 브랜치에 push하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "Update features"
git push origin main
```

### 수동 배포
```bash
# Frontend 빌드
cd frontend
npm run build

# Firebase 배포
cd ..
firebase deploy
```

## 도메인 설정

커스텀 도메인 (seedbasket.ai) 설정은 `DOMAIN_SETUP.md` 파일을 참조하세요.

## API 문서

### 인증
- Firebase Auth를 통한 인증
- 모든 API 요청에 Firebase ID Token 필요

### 주요 엔드포인트
- `GET /api/market/all` - 모든 ETF와 원자재 데이터
- `GET /api/news` - 최신 뉴스
- `POST /api/diary/entries` - 투자 일기 작성
- `POST /api/ai/chat` - AI 챗봇과 대화

## 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 라이선스

MIT License

## 문의

문제가 있거나 제안사항이 있으면 [Issues](https://github.com/yourusername/seedbasket/issues)에 등록해주세요.