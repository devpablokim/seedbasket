import React from 'react';
import { format } from 'date-fns';

const DiaryEntryDetail = ({ entry, onEdit, onClose }) => {
  const getEmotionEmoji = (emotion) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😢';
      default: return '';
    }
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

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Diary Entry - {format(new Date(entry.date), 'MMM d, yyyy')}
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

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Portfolio Value</p>
                <p className="text-2xl font-bold">${Number(entry.portfolioValue).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mood</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getEmotionEmoji(entry.emotion)}</span>
                  <span className="text-lg capitalize">{entry.emotion}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {entry.notes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{entry.notes}</p>
            </div>
          )}

          {/* Tracked ETFs */}
          {entry.selectedETFs && entry.selectedETFs.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Tracked ETFs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {entry.selectedETFs.map((etf) => (
                  <div key={etf.symbol} className="bg-white border border-gray-200 rounded-lg p-3">
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
                ))}
              </div>
            </div>
          )}

          {/* Related News */}
          {entry.selectedNews && entry.selectedNews.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Related News</h4>
              <div className="space-y-2">
                {entry.selectedNews.map((news) => (
                  <div key={news.id} className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${getCategoryColor(news.category)}`}>
                        {news.category}
                      </span>
                      <p className="text-sm text-gray-800 flex-1">{news.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-4">
          <button
            onClick={onEdit}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Edit Entry
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryEntryDetail;