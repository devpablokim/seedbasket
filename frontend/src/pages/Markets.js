import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ETFCard from '../components/ETFCard';

const Markets = () => {
  const [marketData, setMarketData] = useState({ etfs: [], commodities: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/market/all`);
      setMarketData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch market data:', err);
      setError('Failed to fetch market data');
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Markets</h1>
        <p className="mt-2 text-gray-600">
          Complete view of all tracked ETFs and commodities with real-time data
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by symbol or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
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
            All ({marketData.etfs.length + marketData.commodities.length})
          </button>
          <button
            onClick={() => setFilter('etfs')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'etfs'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ETFs ({marketData.etfs.length})
          </button>
          <button
            onClick={() => setFilter('commodities')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'commodities'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Commodities ({marketData.commodities.length})
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No results found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((item) => (
            <ETFCard key={item.symbol} data={item} />
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Showing {data.length} of {marketData.etfs.length + marketData.commodities.length} total instruments</p>
        <p className="mt-1">Data refreshes every 5 minutes during market hours</p>
      </div>
    </div>
  );
};

export default Markets;