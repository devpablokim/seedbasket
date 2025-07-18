import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const News = () => {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [analyzingNews, setAnalyzingNews] = useState({});
  const [analysisResults, setAnalysisResults] = useState({});
  const [translatingNews, setTranslatingNews] = useState({});
  const [translations, setTranslations] = useState({});
  const [showTranslated, setShowTranslated] = useState(false); // Toggle between original and translated
  const [etfIndicators, setEtfIndicators] = useState({});
  const [loadingIndicators, setLoadingIndicators] = useState({});

  useEffect(() => {
    fetchNews();
  }, []);
  
  // Auto-translate all news when component mounts or news updates (only for Korean users)
  useEffect(() => {
    const translateAllNews = async () => {
      for (const article of news) {
        if (!translations[article.id] && !translatingNews[article.id]) {
          setTranslatingNews(prev => ({ ...prev, [article.id]: true }));
          try {
            const response = await api.post(`/news-translation/translate/${article.id}`);
            setTranslations(prev => ({ 
              ...prev, 
              [article.id]: {
                title: response.data.titleTranslation,
                summary: response.data.summaryTranslation
              }
            }));
          } catch (error) {
            console.error('Failed to translate:', error);
          } finally {
            setTranslatingNews(prev => ({ ...prev, [article.id]: false }));
          }
        }
      }
    };
    
    if (news.length > 0 && i18n.language === 'ko') {
      translateAllNews();
    }
  }, [news, i18n.language]);

  const fetchNews = async () => {
    try {
      setRefreshing(true);
      const response = await api.get('/news');
      // Remove duplicates based on title similarity
      const uniqueNews = [];
      const seenTitles = new Set();
      
      response.data.forEach(article => {
        const titleWords = article.title.toLowerCase().split(' ').filter(word => word.length > 3);
        let isDuplicate = false;
        
        for (const seen of seenTitles) {
          const matchCount = titleWords.filter(word => seen.includes(word)).length;
          if (matchCount >= titleWords.length * 0.6) {
            isDuplicate = true;
            break;
          }
        }
        
        if (!isDuplicate) {
          uniqueNews.push(article);
          seenTitles.add(article.title.toLowerCase());
        }
      });
      
      setNews(uniqueNews);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setError(t('news.error'));
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredNews = () => {
    let filtered = news;
    
    if (filter !== 'all') {
      filtered = filtered.filter(article => article.category === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.summary && article.summary.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'macro':
        return 'bg-blue-100 text-blue-800';
      case 'micro':
        return 'bg-purple-100 text-purple-800';
      case 'commodity':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'mixed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading && !refreshing) {
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

  const data = filteredNews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('news.title')}</h1>
            <p className="mt-2 text-gray-600">
              {t('news.subtitle')}
            </p>
          </div>
          <button
            onClick={fetchNews}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg 
              className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            {refreshing ? t('news.refreshing') : t('common.refresh')}
          </button>
        </div>
      </div>


      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={t('common.search')}
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
            {t('news.categories.all')}
          </button>
          <button
            onClick={() => setFilter('macro')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'macro'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('news.categories.macro')}
          </button>
          <button
            onClick={() => setFilter('micro')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'micro'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('news.categories.micro')}
          </button>
          <button
            onClick={() => setFilter('commodity')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'commodity'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('news.categories.commodity')}
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t('news.noNews')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((article) => (
            <div key={article.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(article.category)}`}>
                      {t(`news.categories.${article.category}`, article.category)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {article.publishedAt && !isNaN(new Date(article.publishedAt)) 
                        ? format(new Date(article.publishedAt), 'MMM d, yyyy h:mm a')
                        : 'Recent'}
                    </span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{article.source}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {(i18n.language === 'ko' && !showTranslated) || (i18n.language !== 'ko' && showTranslated) 
                      ? (translations[article.id]?.title || article.title)
                      : article.title}
                  </h3>
                  
                  {article.summary && (
                    <div className="mb-4">
                      <p className="text-gray-600 leading-relaxed">
                        {(i18n.language === 'ko' && !showTranslated) || (i18n.language !== 'ko' && showTranslated)
                          ? (translations[article.id]?.summary || article.summary)
                          : article.summary}
                      </p>
                      <button
                        onClick={() => setShowTranslated(!showTranslated)}
                        className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {i18n.language === 'ko' 
                          ? (showTranslated ? t('news.showKorean') : t('news.showOriginal'))
                          : (showTranslated ? t('news.showOriginal') : t('news.showKorean'))}
                      </button>
                    </div>
                  )}
                  
                  {/* SEEBA AI Analysis Button */}
                  {!article.seebaAnalysis && !analysisResults[article.id] && (
                    <button
                      onClick={async () => {
                        setAnalyzingNews(prev => ({ ...prev, [article.id]: true }));
                        try {
                          const response = await api.post(`/news-analysis/analyze/${article.id}`, {
                            language: i18n.language
                          });
                          setAnalysisResults(prev => ({ 
                            ...prev, 
                            [article.id]: response.data.analysis 
                          }));
                        } catch (error) {
                          console.error('Failed to analyze news:', error);
                        } finally {
                          setAnalyzingNews(prev => ({ ...prev, [article.id]: false }));
                        }
                      }}
                      disabled={analyzingNews[article.id]}
                      className="mt-2 mb-3 flex items-center gap-2 px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className={`w-4 h-4 ${analyzingNews[article.id] ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      {analyzingNews[article.id] ? t('newsSection.analyzing') : t('newsSection.askSeebaAI')}
                    </button>
                  )}
                  
                  {/* SEEBA AI Analysis Result */}
                  {(article.seebaAnalysis || analysisResults[article.id]) && (
                    <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-sm font-semibold text-primary-800">{t('newsSection.seebaAnalysis')}</span>
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-line">
                        {(article.seebaAnalysis || analysisResults[article.id])?.fullAnalysis || 
                         (article.seebaAnalysis || analysisResults[article.id])?.summary}
                      </div>
                    </div>
                  )}
                  
                  {/* ETF Indicators */}
                  {article.impactedETFs && article.impactedETFs.length > 0 && (
                    <div className="mb-4">
                      <button
                        onClick={async () => {
                          if (etfIndicators[article.id]) return;
                          setLoadingIndicators(prev => ({ ...prev, [article.id]: true }));
                          try {
                            const response = await api.get(`/news-translation/etf-indicators/${article.id}`);
                            setEtfIndicators(prev => ({ 
                              ...prev, 
                              [article.id]: response.data.indicators 
                            }));
                          } catch (error) {
                            console.error('Failed to load indicators:', error);
                          } finally {
                            setLoadingIndicators(prev => ({ ...prev, [article.id]: false }));
                          }
                        }}
                        disabled={loadingIndicators[article.id]}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium mb-3 disabled:opacity-50"
                      >
                        {loadingIndicators[article.id] ? t('news.loadingIndicators') : 
                         etfIndicators[article.id] ? t('news.hideIndicators') : t('news.showETFIndicators')}
                      </button>
                      
                      {etfIndicators[article.id] && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {etfIndicators[article.id].map((etf, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <span className="font-semibold text-gray-900">{etf.symbol}</span>
                                  <span className="text-sm text-gray-600 ml-2">{etf.name}</span>
                                </div>
                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(etf.impact)}`}>
                                  {etf.impact}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-lg font-medium">${etf.price}</span>
                                  <span className={`ml-2 text-sm ${etf.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {etf.change >= 0 ? '+' : ''}{etf.change} ({etf.changePercent}%)
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">{etf.reason}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {article.impactedETFs && article.impactedETFs.length > 0 && !article.seebaAnalysis && !analysisResults[article.id] && !etfIndicators[article.id] && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-700">{t('news.aiAnalysis')}</span>
                        <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {article.impactedETFs.map((etf, idx) => (
                          <div
                            key={idx}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border ${getImpactColor(etf.impact)}`}
                          >
                            <span className="font-semibold">{etf.symbol}</span>
                            <span className="text-xs opacity-75">|</span>
                            <span>{etf.reason}</span>
                          </div>
                        ))}
                      </div>
                      {article.impactAnalysis && (
                        <p className="text-sm text-gray-600 mt-3 italic">
                          {article.impactAnalysis}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {t('news.readMore')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>{t('markets.showing', { count: data.length, total: news.length })}</p>
      </div>
    </div>
  );
};

export default News;