# PRD: Seed Basket - Diversified Investment Habit Diary

## 1. Overview
Seed Basket is a web-based dashboard and journaling platform designed to help individual investors build and sustain diversified investment habits. The service integrates real-time financial market data (US ETFs, gold, crude oil) with global macro/micro news analysis, enabling users to understand, track, and record their daily portfolio movements in context.

---

## 2. Goals
- Empower users to form disciplined, long-term diversified investment habits.
- Provide clear, digestible insights into why markets moved each day.
- Offer a seamless workflow to log daily reflections and monitor personal asset growth.
- Make investing approachable by visualizing complex correlations simply.

---

## 3. Core Features

### 3.1 Real-time Data Dashboard
- **Top 20 US ETFs**: Daily price changes (% and absolute)
- **Gold and Crude Oil Prices**: Real-time quotes and daily trends
- **Diversification Matrix**:
  - Visual grid showing inverse correlations (e.g., when equities rise, bonds fall)
  - Heatmap color-coding to indicate volatility

### 3.2 Market Movers News Feed
- Global macroeconomic news (e.g., Fed decisions, inflation data)
- Micro-level events (e.g., earnings reports)
- AI-powered summarization:
  - 3-sentence bullet summary per major event
  - NLP-tagged relevance score per ETF and commodity

### 3.3 Investment Diary
- Daily journal entry form:
  - **Portfolio Value Input** (manual)
  - **Emotion Selection** (emoji): 😊 (Gains), 😐 (Flat), 😢 (Losses)
  - **Personal Notes**
- Auto-snapshot of market data to timestamp entries
- Cumulative asset value chart updated with each entry

### 3.4 Notifications & Reminders
- Daily push/email reminders to complete journal
- Weekly digest summarizing performance and key market events
- "Did You Know?" micro-lessons about diversification benefits

### 3.5 Data Visualization
- **Correlation Spider Chart**: Showing asset interdependence
- **Performance Timeline**: Daily, weekly, monthly views
- **Sentiment Tracker**: Visualizing mood patterns over time

---

## 4. User Personas
1. **Emerging Investor ("Cautious Learner")**
   - Age 25-40
   - Curious about ETFs and commodities
   - Wants to demystify global market drivers
   - Needs structured habit support

2. **Experienced Hobbyist ("Strategic Tracker")**
   - Age 35-55
   - Already owns a diversified portfolio
   - Wants clear analytics and a personal record
   - Enjoys visual dashboards

---

## 5. Functional Requirements

### 5.1 Data Integration
- Integrate APIs for:
  - US ETFs Top 20 prices (e.g., IYR, SPY, QQQ, etc.)
  - Gold and crude oil price feeds
  - Financial news providers (e.g., Reuters, Bloomberg, Financial Times)
- Refresh frequency: every 1 hour during market hours

### 5.2 Frontend
- Responsive web app dashboard
- Intuitive daily journal form
- Interactive visualizations (charts, heatmaps)

### 5.3 Backend
- Time-series database to store daily price snapshots
- User profile and journal entry storage
- NLP module for summarizing news headlines

---

## 6. Non-Functional Requirements
- **Performance**: Data loads within 2 seconds
- **Security**: Encrypted user data, OAuth login
- **Scalability**: Support 100,000+ users

---

## 7. Key Differentiators
- Combines live market data and emotional journaling
- Highlights negative correlations intuitively
- AI summaries contextualize *why* the market moved
- Habit-focused experience: daily reflections and reminders

---

## 8. Success Metrics
- Daily active users
- Journal completion rate (% of users logging entries 4+ days per week)
- Average session time
- User-reported increase in confidence with diversified investing

---

## 9. Roadmap (Suggested)
| Phase             | Milestone                                               |
|-------------------|---------------------------------------------------------|
| Phase 1 (Month 1) | Design wireframes and establish data API contracts      |
| Phase 2 (Month 2) | Build backend data ingestion and storage                |
| Phase 3 (Month 3) | Develop frontend dashboard and journaling features      |
| Phase 4 (Month 4) | Integrate AI news summarization and correlation matrix  |
| Phase 5 (Month 5) | Beta testing and user feedback                          |
| Phase 6 (Month 6) | Public launch                                           |

---

## 10. Naming & Branding
**Seed Basket**
- Visual: Multiple seeds planted in diverse soil
- Tagline: *"Plant Habits. Grow Wealth."*

---

## 11. Future Enhancements (Optional)
- Social sharing of anonymized performance charts
- Gamification: streaks, badges for consistency
- Advanced sentiment analysis on diary entries
- Personalized diversification tips via AI coaching
