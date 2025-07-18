import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { etfDescriptions, etfDescriptionsKo } from '../utils/etfDescriptions';

const ETFCard = ({ data }) => {
  const { i18n } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const isPositive = data.changePercent >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';
  
  const descriptions = i18n.language === 'ko' ? etfDescriptionsKo : etfDescriptions;
  const description = descriptions[data.symbol] || null;

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && description && (
        <div className="absolute z-10 bg-gray-900 text-white p-3 rounded-lg shadow-xl -top-2 left-0 right-0 transform -translate-y-full">
          <div className="text-sm font-semibold mb-1">{description.name}</div>
          <div className="text-xs mb-1">{description.description}</div>
          <div className="text-xs text-gray-300">Holdings: {description.holdings}</div>
          <div className="absolute bottom-0 left-1/2 transform translate-y-full -translate-x-1/2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{data.symbol}</h3>
          <p className="text-sm text-gray-500">{data.name}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${bgColor} ${changeColor}`}>
          {data.type}
        </span>
      </div>
      
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">
          ${Number(data.latestPrice || data.price || 0).toFixed(2)}
        </p>
        <div className={`flex items-center mt-1 ${changeColor}`}>
          <span className="text-sm font-medium">
            {isPositive && '+'}{Number(data.change || 0).toFixed(2)} ({isPositive && '+'}{Number(data.changePercent || 0).toFixed(2)}%)
          </span>
          <svg
            className={`w-4 h-4 ml-1 ${isPositive ? '' : 'transform rotate-180'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {data.volume > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Volume: {(data.volume / 1000000).toFixed(2)}M
          </p>
        </div>
      )}
    </div>
  );
};

export default ETFCard;