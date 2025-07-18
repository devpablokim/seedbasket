import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { useTranslation } from 'react-i18next';
import DiaryForm from '../components/DiaryForm';
import DiaryCalendar from '../components/DiaryCalendar';
import DiaryEntryDetail from '../components/DiaryEntryDetail';
import PortfolioChart from '../components/PortfolioChart';

const Diary = () => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      
      const response = await api.get('/diary/entries', {
        params: {
          startDate: format(start, 'yyyy-MM-dd'),
          endDate: format(end, 'yyyy-MM-dd')
        }
      });
      
      setEntries(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const existingEntry = entries.find(entry => entry.date === format(date, 'yyyy-MM-dd'));
    if (existingEntry) {
      setSelectedEntry(existingEntry);
      setShowDetail(true);
    } else {
      setShowForm(true);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    fetchEntries();
  };

  const handleDetailClose = () => {
    setShowDetail(false);
    setSelectedEntry(null);
  };

  const handleEdit = () => {
    setShowDetail(false);
    setShowForm(true);
  };

  const getEmotionStats = () => {
    const stats = {
      happy: 0,
      neutral: 0,
      sad: 0
    };
    
    entries.forEach(entry => {
      stats[entry.emotion]++;
    });
    
    return stats;
  };

  const emotionStats = getEmotionStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('diary.title')}</h1>
        <p className="mt-2 text-gray-600">{t('diary.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('diary.monthlyCalendar')}</h2>
            <DiaryCalendar 
              entries={entries} 
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
            />
          </div>

          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('diary.portfolioPerformance')}</h2>
            <PortfolioChart entries={entries} />
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('diary.emotionSummary')}</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">😊</span>
                  <span className="text-sm text-gray-600">{t('diary.happyDays')}</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{emotionStats.happy}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">😐</span>
                  <span className="text-sm text-gray-600">{t('diary.neutralDays')}</span>
                </div>
                <span className="text-2xl font-bold text-gray-600">{emotionStats.neutral}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">😢</span>
                  <span className="text-sm text-gray-600">{t('diary.sadDays')}</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{emotionStats.sad}</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md"
              >
                {t('diary.addTodayEntry')}
              </button>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('diary.recentEntries')}</h2>
            <div className="space-y-3">
              {entries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {format(new Date(entry.date), 'MMM d')}
                    </span>
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {entry.emotion === 'happy' ? '😊' : entry.emotion === 'neutral' ? '😐' : '😢'}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        ${entry.portfolioValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {entry.notes && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{entry.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <DiaryForm
          date={selectedDate}
          onClose={handleFormClose}
          existingEntry={selectedEntry || entries.find(e => e.date === format(selectedDate, 'yyyy-MM-dd'))}
        />
      )}

      {showDetail && selectedEntry && (
        <DiaryEntryDetail
          entry={selectedEntry}
          onEdit={handleEdit}
          onClose={handleDetailClose}
        />
      )}
    </div>
  );
};

export default Diary;