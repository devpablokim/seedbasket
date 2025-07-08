import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    
    // Get current path without language prefix
    const currentPath = location.pathname;
    let cleanPath = currentPath;
    
    // Remove /ko prefix if present
    if (currentPath.startsWith('/ko')) {
      cleanPath = currentPath.slice(3) || '/';
    }
    
    // Navigate to new path with or without language prefix
    if (lng === 'ko') {
      navigate(`/ko${cleanPath}`);
    } else {
      navigate(cleanPath);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          i18n.language === 'en'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('ko')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          i18n.language === 'ko'
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        한글
      </button>
    </div>
  );
};

export default LanguageSelector;