import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';
import ETFCard from '../components/ETFCard';
import MarketOverview from '../components/MarketOverview';
import NewsSection from '../components/NewsSection';
import MarketInfo from '../components/MarketInfo';
import { mockMarketData, mockNews } from '../utils/mockData';

const Dashboard = () => {
  const { t } = useTranslation();
  const [marketData, setMarketData] = useState({ etfs: [], commodities: [] });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [etfSortBy, setEtfSortBy] = useState('alphabet'); // 'gainers', 'losers', 'alphabet'
  const [commoditySortBy, setCommoditySortBy] = useState('alphabet'); // same options as ETF

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch market data
      const marketResponse = await api.get('/market/all');
      setMarketData(marketResponse.data);
      
      // Fetch news separately to avoid blocking if it fails
      try {
        console.log('Fetching news with token:', api.defaults.headers.common?.['Authorization'] ? 'Present' : 'Missing');
        const newsResponse = await api.get('/news/today');
        console.log('News response:', newsResponse.data);
        setNews(newsResponse.data);
      } catch (newsErr) {
        console.error('Failed to fetch news:', newsErr.response || newsErr);
        setNews(mockNews); // Use mock news on error
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Use mock data instead of showing error
      console.log('Using mock data for layout display');
      setMarketData(mockMarketData);
      setNews(mockNews);
      setError(null); // Clear error to show layout
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    setNewsLoading(true);
    try {
      const newsResponse = await api.get('/news/today');
      setNews(newsResponse.data);
    } catch (newsErr) {
      console.error('Failed to fetch news:', newsErr);
      // Use mock news on error
      setNews(mockNews);
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

  // Sort ETFs based on selected criteria
  const getSortedETFs = () => {
    const etfs = [...marketData.etfs];
    
    switch (etfSortBy) {
      case 'gainers':
        return etfs.sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));
      case 'losers':
        return etfs.sort((a, b) => (a.changePercent || 0) - (b.changePercent || 0));
      case 'alphabet':
        return etfs.sort((a, b) => a.symbol.localeCompare(b.symbol));
      default:
        return etfs;
    }
  };

  // Sort Commodities based on selected criteria
  const getSortedCommodities = () => {
    const commodities = [...marketData.commodities];
    
    switch (commoditySortBy) {
      case 'gainers':
        return commodities.sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0));
      case 'losers':
        return commodities.sort((a, b) => (a.changePercent || 0) - (b.changePercent || 0));
      case 'alphabet':
        return commodities.sort((a, b) => a.symbol.localeCompare(b.symbol));
      default:
        return commodities;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="mt-2 text-gray-600">{t('dashboard.subtitle')}</p>
      </div>

      <MarketInfo />
      
      <MarketOverview marketData={marketData} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.topETFs')}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setEtfSortBy('alphabet')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  etfSortBy === 'alphabet'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('dashboard.sortByAlphabet')}
              </button>
              <button
                onClick={() => setEtfSortBy('gainers')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  etfSortBy === 'gainers'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('dashboard.sortByGainers')}
              </button>
              <button
                onClick={() => setEtfSortBy('losers')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  etfSortBy === 'losers'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('dashboard.sortByLosers')}
              </button>
            </div>
          </div>
          <Link to="/markets" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            {t('dashboard.viewAllETFs')}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getSortedETFs().slice(0, 12).map((etf) => (
            <ETFCard key={etf.symbol} data={etf} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.commodities')}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCommoditySortBy('alphabet')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  commoditySortBy === 'alphabet'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('dashboard.sortByAlphabet')}
              </button>
              <button
                onClick={() => setCommoditySortBy('gainers')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  commoditySortBy === 'gainers'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('dashboard.sortByGainers')}
              </button>
              <button
                onClick={() => setCommoditySortBy('losers')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  commoditySortBy === 'losers'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('dashboard.sortByLosers')}
              </button>
            </div>
          </div>
          <Link to="/markets?filter=commodities" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            {t('dashboard.viewAllCommodities')}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getSortedCommodities().slice(0, 6).map((commodity) => (
            <ETFCard key={commodity.symbol} data={commodity} />
          ))}
        </div>
      </div>

      <NewsSection news={news} onRefresh={refreshNews} loading={newsLoading} />
    </div>
  );
};

export default Dashboard;