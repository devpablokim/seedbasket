import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import MarketClock from './MarketClock';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <MarketClock />
      <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">🌱 {t('common.appName')}</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to={i18n.language === 'ko' ? '/ko' : '/'}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') || isActive('/ko')
                    ? 'border-primary-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {t('nav.dashboard')}
              </Link>
              <Link
                to={i18n.language === 'ko' ? '/ko/diary' : '/diary'}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/diary') || isActive('/ko/diary')
                    ? 'border-primary-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {t('nav.diary')}
              </Link>
              <Link
                to={i18n.language === 'ko' ? '/ko/ask-ai' : '/ask-ai'}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/ask-ai') || isActive('/ko/ask-ai')
                    ? 'border-primary-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {t('nav.seebaAI')}
              </Link>
              <Link
                to={i18n.language === 'ko' ? '/ko/markets' : '/markets'}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/markets') || isActive('/ko/markets')
                    ? 'border-primary-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {t('nav.markets')}
              </Link>
              <Link
                to={i18n.language === 'ko' ? '/ko/news' : '/news'}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/news') || isActive('/ko/news')
                    ? 'border-primary-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {t('nav.news')}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <span className="text-sm text-gray-700">{t('dashboard.welcome', { name: user?.name })}</span>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md text-sm"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;