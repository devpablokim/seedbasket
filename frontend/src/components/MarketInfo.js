import React from 'react';
import { useTranslation } from 'react-i18next';

const MarketInfo = () => {
  const { t } = useTranslation();
  const marketHours = [
    { session: t('marketInfo.preMarket'), time: '4:00 AM - 9:30 AM ET', active: false },
    { session: t('marketInfo.regularTrading'), time: '9:30 AM - 4:00 PM ET', active: true },
    { session: t('marketInfo.afterHours'), time: '4:00 PM - 8:00 PM ET', active: false }
  ];

  const holidays2025 = [
    { date: 'Jan 1', name: t('marketInfo.holidays.newYearsDay') },
    { date: 'Jan 20', name: t('marketInfo.holidays.martinLutherKingDay') },
    { date: 'Feb 17', name: t('marketInfo.holidays.presidentsDay') },
    { date: 'Apr 18', name: t('marketInfo.holidays.goodFriday') },
    { date: 'May 26', name: t('marketInfo.holidays.memorialDay') },
    { date: 'Jun 19', name: t('marketInfo.holidays.juneteenth') },
    { date: 'Jul 4', name: t('marketInfo.holidays.independenceDay') },
    { date: 'Sep 1', name: t('marketInfo.holidays.laborDay') },
    { date: 'Nov 27', name: t('marketInfo.holidays.thanksgivingDay') },
    { date: 'Dec 25', name: t('marketInfo.holidays.christmasDay') }
  ];

  // 다음 휴일 찾기
  const today = new Date();
  const nextHoliday = holidays2025.find(holiday => {
    const holidayDate = new Date(`${holiday.date}, 2025`);
    return holidayDate > today;
  }) || holidays2025[0];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('marketInfo.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">{t('marketInfo.tradingSessions')}</h3>
          <div className="space-y-2">
            {marketHours.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                <div>
                  <div className="font-medium text-sm text-gray-900">{session.session}</div>
                  <div className="text-xs text-gray-500">{session.time}</div>
                </div>
                {session.active && (
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                    {t('marketInfo.mainSession')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">{t('marketInfo.marketStatus')}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">NYSE</span>
              <span className="text-sm font-medium">New York Stock Exchange</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">NASDAQ</span>
              <span className="text-sm font-medium">NASDAQ Stock Market</span>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-md">
              <div className="text-xs font-medium text-yellow-800">{t('marketInfo.nextMarketHoliday')}</div>
              <div className="text-sm text-yellow-900 mt-1">
                {nextHoliday.name} - {nextHoliday.date}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        {t('marketInfo.note')}
      </div>
    </div>
  );
};

export default MarketInfo;