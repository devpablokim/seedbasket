import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import './NewsSection.css';

const NewsSection = ({ news, onRefresh, loading }) => {
  const { t, i18n } = useTranslation();
  const [analyzingNews, setAnalyzingNews] = useState({});
  const [analysisResults, setAnalysisResults] = useState({});
  const [translations, setTranslations] = useState({});
  const [translatingNews, setTranslatingNews] = useState({});
  const [showTranslated, setShowTranslated] = useState(false);
  
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

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{t('newsSection.title')}</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTranslated(!showTranslated)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {i18n.language === 'ko' 
              ? (showTranslated ? t('newsSection.showKorean') : t('newsSection.showOriginal'))
              : (showTranslated ? t('newsSection.showOriginal') : t('newsSection.showKorean'))}
          </button>
          <a href="/news" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            {t('newsSection.viewAllNews')}
          </a>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
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
            {loading ? t('newsSection.loading') : t('newsSection.refreshNews')}
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-primary-600 mb-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500">{t('newsSection.loadingNews')}</p>
          </div>
        </div>
      ) : news.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-gray-500 mb-3">{t('newsSection.noNewsAvailable')}</p>
            <button
              onClick={onRefresh}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('newsSection.tryRefreshing')}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {news.slice(0, 5).map((article) => (
            <div key={article.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(article.category)}`}>
                      {t(`newsSection.categories.${article.category}`, article.category)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {article.publishedAt && !isNaN(new Date(article.publishedAt)) 
                        ? format(new Date(article.publishedAt), 'MMM d, h:mm a')
                        : 'Recent'}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-gray-900 mb-1">
                    {(i18n.language === 'ko' && !showTranslated) || (i18n.language !== 'ko' && showTranslated) 
                      ? (translations[article.id]?.title || article.title)
                      : article.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {(i18n.language === 'ko' && !showTranslated) || (i18n.language !== 'ko' && showTranslated)
                      ? (translations[article.id]?.summary || article.summary)
                      : article.summary}
                  </p>
                  
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
                      className="mt-2 mb-3 flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className={`w-4 h-4 ${analyzingNews[article.id] ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      {analyzingNews[article.id] ? t('newsSection.analyzing') : t('newsSection.askSeebaAI')}
                    </button>
                  )}
                  
                  {/* SEEBA AI Analysis Result */}
                  {(article.seebaAnalysis || analysisResults[article.id]) && (
                    <div className="mt-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
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
                  
                  {article.impactedETFs && article.impactedETFs.length > 0 && !article.seebaAnalysis && !analysisResults[article.id] && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-700">{t('newsSection.aiImpactAnalysis')}</span>
                        <svg className="w-4 h-4 text-primary-600 ai-badge" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {article.impactedETFs.slice(0, 3).map((etf, idx) => (
                          <div
                            key={idx}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(etf.impact)}`}
                          >
                            <span className="font-semibold">{etf.symbol}</span>
                            <span className="text-xs opacity-75">|</span>
                            <span className="truncate max-w-[100px]">{etf.reason}</span>
                          </div>
                        ))}
                      </div>
                      {article.impactAnalysis && (
                        <p className="text-xs text-gray-600 mt-2 italic">
                          {article.impactAnalysis}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-gray-500">{article.source}</span>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 text-xs text-primary-600 hover:text-primary-700"
                    >
                      {t('newsSection.readMore')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSection;