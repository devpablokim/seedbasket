import React from 'react';

const MarketOverview = ({ marketData }) => {
  const calculateOverallChange = () => {
    const allAssets = [...marketData.etfs, ...marketData.commodities];
    const positiveCount = allAssets.filter(asset => Number(asset.changePercent) > 0).length;
    const negativeCount = allAssets.filter(asset => Number(asset.changePercent) < 0).length;
    const neutralCount = allAssets.filter(asset => Number(asset.changePercent) === 0).length;
    
    return { positiveCount, negativeCount, neutralCount };
  };

  const { positiveCount, negativeCount, neutralCount } = calculateOverallChange();
  const total = positiveCount + negativeCount + neutralCount;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-green-600">{positiveCount}</p>
          <p className="text-sm text-gray-500">Gainers</p>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-600">{neutralCount}</p>
          <p className="text-sm text-gray-500">Unchanged</p>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-2">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-red-600">{negativeCount}</p>
          <p className="text-sm text-gray-500">Losers</p>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Market Sentiment</span>
          <span className="text-sm font-medium text-gray-900">
            {positiveCount > negativeCount ? 'Bullish' : positiveCount < negativeCount ? 'Bearish' : 'Neutral'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="flex h-2 rounded-full overflow-hidden">
            <div 
              className="bg-green-500" 
              style={{ width: `${(positiveCount / total) * 100}%` }}
            />
            <div 
              className="bg-gray-400" 
              style={{ width: `${(neutralCount / total) * 100}%` }}
            />
            <div 
              className="bg-red-500" 
              style={{ width: `${(negativeCount / total) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;