import React, { useEffect } from 'react';
import { useParams, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageWrapper = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set language to Korean when accessing /ko routes
    i18n.changeLanguage('ko');
    
    // Reset to English when component unmounts
    return () => {
      i18n.changeLanguage('en');
    };
  }, [i18n]);

  return <Outlet />;
};

export default LanguageWrapper;