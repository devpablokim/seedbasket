import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

const DiaryCalendar = ({ entries, onDateSelect, selectedDate }) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const getEntryForDate = (date) => {
    return entries.find(entry => entry.date === format(date, 'yyyy-MM-dd'));
  };
  
  const getEmotionEmoji = (emotion) => {
    switch (emotion) {
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😢';
      default: return '';
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-px mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day) => {
          const entry = getEntryForDate(day);
          const isCurrentMonth = isSameMonth(day, selectedDate);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          
          return (
            <button
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              className={`
                bg-white p-2 h-20 text-left hover:bg-gray-50 transition-colors
                ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                ${isSelected ? 'ring-2 ring-primary-500' : ''}
                ${isToday ? 'bg-primary-50' : ''}
              `}
            >
              <div className="text-sm font-medium mb-1">{format(day, 'd')}</div>
              {entry && (
                <div className="space-y-1">
                  <div className="text-xl">{getEmotionEmoji(entry.emotion)}</div>
                  <div className="text-xs text-gray-600 truncate">
                    ${(entry.portfolioValue / 1000).toFixed(1)}k
                  </div>
                </div>
              )}
              {!entry && isCurrentMonth && (
                <div className="text-xs text-gray-400">No entry</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DiaryCalendar;