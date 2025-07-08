import React, { useState, useEffect } from 'react';

const MarketClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState({ isOpen: false, nextEvent: '' });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
      const day = nyTime.getDay();
      const hours = nyTime.getHours();
      const minutes = nyTime.getMinutes();
      const currentMinutes = hours * 60 + minutes;

      // 주말 체크
      if (day === 0 || day === 6) {
        setMarketStatus({ 
          isOpen: false, 
          nextEvent: 'Market opens Monday 9:30 AM ET' 
        });
        return;
      }

      // 평일 시장 시간 체크 (9:30 AM - 4:00 PM ET)
      const marketOpen = 9 * 60 + 30; // 570 minutes
      const marketClose = 16 * 60; // 960 minutes

      if (currentMinutes < marketOpen) {
        const minutesUntilOpen = marketOpen - currentMinutes;
        const hoursUntil = Math.floor(minutesUntilOpen / 60);
        const minsUntil = minutesUntilOpen % 60;
        setMarketStatus({ 
          isOpen: false, 
          nextEvent: `Opens in ${hoursUntil}h ${minsUntil}m` 
        });
      } else if (currentMinutes >= marketOpen && currentMinutes < marketClose) {
        const minutesUntilClose = marketClose - currentMinutes;
        const hoursUntil = Math.floor(minutesUntilClose / 60);
        const minsUntil = minutesUntilClose % 60;
        setMarketStatus({ 
          isOpen: true, 
          nextEvent: `Closes in ${hoursUntil}h ${minsUntil}m` 
        });
      } else {
        setMarketStatus({ 
          isOpen: false, 
          nextEvent: 'Opens tomorrow 9:30 AM ET' 
        });
      }
    };

    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date, timeZone) => {
    return date.toLocaleTimeString('en-US', {
      timeZone,
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date, timeZone) => {
    return date.toLocaleDateString('en-US', {
      timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const nyTime = formatTime(currentTime, 'America/New_York');
  const nyDate = formatDate(currentTime, 'America/New_York');
  const localTime = formatTime(currentTime, Intl.DateTimeFormat().resolvedOptions().timeZone);
  const localDate = formatDate(currentTime, Intl.DateTimeFormat().resolvedOptions().timeZone);

  return (
    <div className="bg-gray-900 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-xs text-gray-400">New York (ET)</div>
                <div className="font-semibold">{nyTime}</div>
                <div className="text-xs text-gray-500">{nyDate}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div>
                <div className="text-xs text-gray-400">Local Time</div>
                <div className="font-semibold">{localTime}</div>
                <div className="text-xs text-gray-500">{localDate}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              marketStatus.isOpen 
                ? 'bg-green-900/50 border border-green-600' 
                : 'bg-red-900/50 border border-red-600'
            }`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                marketStatus.isOpen ? 'bg-green-400' : 'bg-red-400'
              }`} />
              <span className="font-medium">
                {marketStatus.isOpen ? 'Market Open' : 'Market Closed'}
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {marketStatus.nextEvent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketClock;