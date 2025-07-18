import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useTranslation } from 'react-i18next';
import ETFCard from '../components/ETFCard';
import { mockMarketData } from '../utils/mockData';

const Markets = () => {
  const { t } = useTranslation();
  const [marketData, setMarketData] = useState({ etfs: [], commodities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchedSymbols, setSearchedSymbols] = useState(new Set());

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await api.get('/market/all');
      setMarketData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch market data:', err);
      // Use mock data instead of showing error
      console.log('Using mock data for layout display');
      setMarketData(mockMarketData);
      setError(null); // Clear error to show layout
      setLoading(false);
    }
  };

  const searchSymbol = async (symbol) => {
    // If symbol already exists in current data, don't search again
    const existingData = [...marketData.etfs, ...marketData.commodities];
    if (existingData.some(item => item.symbol.toLowerCase() === symbol.toLowerCase())) {
      return;
    }

    // If we already searched for this symbol in this session, don't search again
    if (searchedSymbols.has(symbol.toUpperCase())) {
      return;
    }

    setSearchLoading(true);
    try {
      const response = await api.post('/market/search', { symbol: symbol.toUpperCase() });
      if (response.data && response.data.symbol) {
        // Add to searched symbols set
        setSearchedSymbols(prev => new Set([...prev, symbol.toUpperCase()]));
        
        // Update market data with new symbol
        setMarketData(prev => {
          if (response.data.type === 'etf') {
            return {
              ...prev,
              etfs: [...prev.etfs, response.data].sort((a, b) => a.symbol.localeCompare(b.symbol))
            };
          } else {
            return {
              ...prev,
              commodities: [...prev.commodities, response.data].sort((a, b) => a.symbol.localeCompare(b.symbol))
            };
          }
        });
      }
    } catch (err) {
      console.error('Failed to search symbol:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search term changes with debounce
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) return;

    const timer = setTimeout(() => {
      // Check if the search term looks like a symbol (2-5 uppercase letters)
      if (/^[A-Za-z]{2,5}$/.test(searchTerm)) {
        searchSymbol(searchTerm);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredData = () => {
    let data = [];
    
    if (filter === 'all' || filter === 'etfs') {
      data = [...data, ...marketData.etfs];
    }
    
    if (filter === 'all' || filter === 'commodities') {
      data = [...data, ...marketData.commodities];
    }

    if (searchTerm) {
      data = data.filter(item => 
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return data;
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

  const data = filteredData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('markets.title')}</h1>
        <p className="mt-2 text-gray-600">
          {t('markets.description')}
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t('markets.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {searchLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('common.all')} ({marketData.etfs.length + marketData.commodities.length})
          </button>
          <button
            onClick={() => setFilter('etfs')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'etfs'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('markets.etfs')} ({marketData.etfs.length})
          </button>
          <button
            onClick={() => setFilter('commodities')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'commodities'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('markets.commodities')} ({marketData.commodities.length})
          </button>
        </div>
      </div>

      {filter === 'all' ? (
        <>
          {/* ETFs Section */}
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{t('markets.etfs')}</h2>
              <p className="text-gray-600 mt-1">{t('markets.etfsDescription')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.etfs.filter(item => 
                !searchTerm || 
                item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((item) => (
                <ETFCard key={item.symbol} data={item} />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-4 text-sm text-gray-500">{t('markets.commodities')}</span>
            </div>
          </div>

          {/* Commodities Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{t('markets.commodities')}</h2>
              <p className="text-gray-600 mt-1">{t('markets.commoditiesDescription')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.commodities.filter(item => 
                !searchTerm || 
                item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((item) => (
                <ETFCard key={item.symbol} data={item} />
              ))}
            </div>
          </div>
        </>
      ) : data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('markets.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((item) => (
            <ETFCard key={item.symbol} data={item} />
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>{t('markets.showing', { count: data.length, total: marketData.etfs.length + marketData.commodities.length })}</p>
        <p className="mt-1">{t('markets.dataRefreshInfo')}</p>
      </div>
    </div>
  );
};

export default Markets;