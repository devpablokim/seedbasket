# SEED BASKET AI 🌱

AI-powered investment tracking platform with real-time market data, investment diary, and intelligent news analysis.

## Features

- 📊 **Real-time Market Data**: Track ETFs and commodities with live price updates
- 📖 **Investment Diary**: Document your investment journey with portfolio tracking and emotional insights
- 📰 **AI-Powered News Analysis**: Get market news with AI analysis showing ETF impact predictions
- 🤖 **Ask AI**: Chat with an AI investment advisor that has access to real-time market data
- ⏰ **Market Clock**: US market hours tracking with open/closed status
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express, Sequelize
- **Database**: MySQL
- **AI**: OpenAI GPT-4
- **APIs**: Alpha Vantage (market data), NewsAPI (news)
- **Deployment**: Docker Compose

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- API Keys:
  - [Alpha Vantage API Key](https://www.alphavantage.co/support/#api-key)
  - [NewsAPI Key](https://newsapi.org/register)
  - [OpenAI API Key](https://platform.openai.com/api-keys)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/seedbasket.git
cd seedbasket
```

2. Copy the environment file and add your API keys:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys
```

3. Start the application with Docker Compose:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:3002
- Backend API: http://localhost:5002

## Development

### Running locally without Docker:

1. Install backend dependencies:
```bash
cd backend
npm install
npm run dev
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
npm start
```

### Database Setup

The MySQL database will be automatically initialized with the required schema when you run the application.

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Market Data
- `GET /api/market/all` - Get all ETFs and commodities
- `GET /api/market/history/:symbol` - Get historical data for a symbol

### News
- `GET /api/news` - Get all news
- `GET /api/news/today` - Get recent news (last 7 days)

### Diary
- `GET /api/diary/entries` - Get user's diary entries
- `POST /api/diary/entries` - Create new diary entry
- `PUT /api/diary/entries/:date` - Update diary entry

### AI Chat
- `POST /api/ai/chat` - Send message to AI assistant
- `GET /api/ai/conversations` - Get chat history

## Environment Variables

See `backend/.env.example` for all required environment variables.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Market data provided by Alpha Vantage
- News data provided by NewsAPI
- AI powered by OpenAI GPT-4
EOF < /dev/null