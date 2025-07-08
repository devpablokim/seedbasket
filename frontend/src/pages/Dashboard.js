import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ETFCard from '../components/ETFCard';
import MarketOverview from '../components/MarketOverview';
import NewsSection from '../components/NewsSection';
import MarketInfo from '../components/MarketInfo';

const Dashboard = () => {
  const [marketData, setMarketData] = useState({ etfs: [], commodities: [] });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch market data
      const marketResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/market/all`);
      setMarketData(marketResponse.data);
      
      // Fetch news separately to avoid blocking if it fails
      try {
        console.log('Fetching news with token:', axios.defaults.headers.common['Authorization'] ? 'Present' : 'Missing');
        const newsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/news/today`);
        console.log('News response:', newsResponse.data);
        setNews(newsResponse.data);
      } catch (newsErr) {
        console.error('Failed to fetch news:', newsErr.response || newsErr);
        setNews([]); // Set empty news array on error
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to fetch market data');
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    setNewsLoading(true);
    try {
      const newsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/news/today`);
      setNews(newsResponse.data);
    } catch (newsErr) {
      console.error('Failed to fetch news:', newsErr);
      // Show a brief error message
      const previousNews = news;
      setNews([{ 
        id: 'error', 
        title: 'Failed to load news. Please try again.', 
        category: 'error',
        publishedAt: new Date(),
        source: 'System',
        url: '#'
      }]);
      // Revert to previous news after 3 seconds
      setTimeout(() => setNews(previousNews), 3000);
    } finally {
      setNewsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI-Powered Market Dashboard</h1>
        <p className="mt-2 text-gray-600">Track your portfolio with intelligent insights and real-time AI analysis</p>
      </div>

      <MarketInfo />
      
      <MarketOverview marketData={marketData} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Top ETFs</h2>
          <Link to="/markets" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All ETFs →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData.etfs.slice(0, 8).map((etf) => (
            <ETFCard key={etf.symbol} data={etf} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Commodities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketData.commodities.map((commodity) => (
            <ETFCard key={commodity.symbol} data={commodity} />
          ))}
        </div>
      </div>

      <NewsSection news={news} onRefresh={refreshNews} loading={newsLoading} />
    </div>
  );
};

export default Dashboard;