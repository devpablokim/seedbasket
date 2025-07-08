import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const DiaryForm = ({ date, onClose, existingEntry }) => {
  const [portfolioValue, setPortfolioValue] = useState(existingEntry?.portfolioValue || '');
  const [emotion, setEmotion] = useState(existingEntry?.emotion || 'neutral');
  const [notes, setNotes] = useState(existingEntry?.notes || '');
  const [selectedETFs, setSelectedETFs] = useState(existingEntry?.selectedETFs || []);
  const [selectedNews, setSelectedNews] = useState(existingEntry?.selectedNews || []);
  const [marketData, setMarketData] = useState({ etfs: [], commodities: [] });
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    fetchMarketAndNews();
  }, []);

  const fetchMarketAndNews = async () => {
    try {
      const [marketResponse, newsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/market/all`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/news`)
      ]);
      setMarketData(marketResponse.data);
      setNewsData(newsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleETFToggle = (etf) => {
    const isSelected = selectedETFs.some(e => e.symbol === etf.symbol);
    if (isSelected) {
      setSelectedETFs(selectedETFs.filter(e => e.symbol !== etf.symbol));
    } else {
      setSelectedETFs([...selectedETFs, {
        symbol: etf.symbol,
        name: etf.name,
        price: etf.price,
        change: etf.change,
        changePercent: etf.changePercent
      }]);
    }
  };

  const handleNewsToggle = (news) => {
    const isSelected = selectedNews.some(n => n.id === news.id);
    if (isSelected) {
      setSelectedNews(selectedNews.filter(n => n.id !== news.id));
    } else {
      setSelectedNews([...selectedNews, {
        id: news.id,
        title: news.title,
        category: news.category
      }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const data = {
        date: formattedDate,
        portfolioValue: parseFloat(portfolioValue),
        emotion,
        notes,
        selectedETFs,
        selectedNews
      };

      if (existingEntry) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/diary/entries/${formattedDate}`, data);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/diary/entries`, data);
      }

      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  const emotions = [
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'sad', emoji: '😢', label: 'Sad' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {existingEntry ? 'Edit' : 'Add'} Entry - {format(date, 'MMM d, yyyy')}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'basic' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Basic Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('etfs')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'etfs' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Track ETFs ({selectedETFs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'news' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Related News ({selectedNews.length})
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pb-20">
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio Value ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={portfolioValue}
                    onChange={(e) => setPortfolioValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="50000.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How are you feeling?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {emotions.map((em) => (
                      <button
                        key={em.value}
                        type="button"
                        onClick={() => setEmotion(em.value)}
                        className={`p-3 rounded-lg border-2 text-center transition-colors ${
                          emotion === em.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{em.emoji}</span>
                        <span className="text-sm text-gray-600">{em.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Reflect on today's market movements and your investment decisions..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'etfs' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Select ETFs to track in today's diary entry:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {[...marketData.etfs, ...marketData.commodities].map((etf) => {
                    const isSelected = selectedETFs.some(e => e.symbol === etf.symbol);
                    return (
                      <div
                        key={etf.symbol}
                        onClick={() => handleETFToggle(etf)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{etf.symbol}</span>
                            <span className="text-sm text-gray-600 ml-2">{etf.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${Number(etf.price).toFixed(2)}</div>
                            <div className={`text-sm ${
                              Number(etf.change) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {Number(etf.change) >= 0 ? '+' : ''}{Number(etf.change).toFixed(2)} ({Number(etf.changePercent).toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'news' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Select news articles relevant to your portfolio ({newsData.length} articles available):</p>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {newsData.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No news available</p>
                  ) : (
                    newsData.map((news) => {
                      const isSelected = selectedNews.some(n => n.id === news.id);
                      return (
                        <div
                          key={news.id}
                          onClick={() => handleNewsToggle(news)}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="mt-1"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                  news.category === 'macro' ? 'bg-blue-100 text-blue-800' :
                                  news.category === 'micro' ? 'bg-purple-100 text-purple-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {news.category}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {format(new Date(news.publishedAt), 'MMM d, yyyy')}
                                </span>
                              </div>
                              <h4 className="text-sm font-medium text-gray-900">{news.title}</h4>
                              {news.summary && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{news.summary}</p>
                              )}
                              {news.impactedETFs && news.impactedETFs.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {news.impactedETFs.slice(0, 3).map((etf, idx) => (
                                    <span key={idx} className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
                                      {etf.symbol}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Entry'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiaryForm;