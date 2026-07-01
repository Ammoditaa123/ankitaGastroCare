'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const popularData = {
  Mon: [10, 15, 30, 55, 70, 60, 40, 35, 50, 65, 55, 30, 15],
  Tue: [10, 20, 35, 60, 75, 65, 45, 40, 55, 70, 60, 32, 15],
  Wed: [10, 18, 32, 58, 72, 62, 42, 38, 52, 68, 58, 30, 14],
  Thu: [12, 22, 38, 62, 78, 68, 48, 42, 58, 72, 62, 34, 16],
  Fri: [15, 28, 45, 70, 85, 75, 55, 50, 65, 80, 68, 40, 20],
  Sat: [20, 40, 60, 85, 95, 90, 70, 60, 75, 88, 72, 45, 22],
  Sun: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

const labels = ["9am", "10", "11", "12p", "1", "2", "3", "4", "5", "6", "7", ""];
const days = Object.keys(popularData) as Array<keyof typeof popularData>;

export const PopularTimes: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<keyof typeof popularData>('Mon');
  const [currentHour, setCurrentHour] = useState<number>(12);
  const [todayDayName, setTodayDayName] = useState<string>('Mon');

  useEffect(() => {
    const today = new Date();
    // Get day name (Mon, Tue, Wed...)
    const dayIndices = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayName = dayIndices[today.getDay()] as keyof typeof popularData;
    setTodayDayName(currentDayName);
    
    // Default selected day to today (if Sunday, default to Mon)
    setSelectedDay(currentDayName === 'Sun' ? 'Mon' : currentDayName);

    // Get current hour
    setCurrentHour(today.getHours());
  }, []);

  const colorFor = (val: number) => {
    if (val === 0) return 'bg-sand-deep';
    if (val < 40) return 'bg-ok'; // Quiet
    if (val < 70) return 'bg-busy'; // Moderate
    return 'bg-full'; // Busy
  };

  const getStatusText = (day: keyof typeof popularData) => {
    if (day === 'Sun') {
      return t('sundayClosed');
    }

    const data = popularData[day];
    const isToday = day === todayDayName;

    if (isToday) {
      const idx = Math.min(Math.max(currentHour - 9, 0), 12);
      const val = data[idx];
      
      let levelText = '';
      if (val === 0) {
        levelText = language === 'en' ? 'Closed' : 'बंद';
      } else if (val < 40) {
        levelText = t('legendQuiet');
      } else if (val < 70) {
        levelText = t('legendModerate');
      } else {
        levelText = t('legendBusy');
      }

      if (val === 0) {
        return language === 'en' 
          ? `Right now: <b>${levelText}</b>.` 
          : `इस समय: <b>${levelText}</b>।`;
      }

      const pattern = t('rightNowPattern');
      return pattern.replace('{level}', levelText);
    } else {
      return t('quietestTip');
    }
  };

  return (
    <div className="bg-white border border-ink/10 p-6 md:p-8 rounded-sm shadow-sm">
      <h4 className="font-serif text-lg font-bold text-teal-deep mb-1">
        {t('popularTimesTitle')}
      </h4>
      <p className="text-xs text-ink/60 mb-6">
        {t('popularTimesSub')}
      </p>

      {/* Day Selector */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {days.map((day) => {
          const isToday = day === todayDayName;
          const displayDay = language === 'en' 
            ? day 
            : day === 'Mon' ? 'सोम'
            : day === 'Tue' ? 'मंगल'
            : day === 'Wed' ? 'बुध'
            : day === 'Thu' ? 'गुरु'
            : day === 'Fri' ? 'शुक्र'
            : day === 'Sat' ? 'शनि'
            : 'रवि';

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`text-xs font-bold px-3 py-1.5 border transition-all duration-200 cursor-pointer ${
                selectedDay === day
                  ? 'bg-teal-deep text-sand-light border-teal-deep shadow-sm'
                  : 'bg-transparent text-ink/75 border-ink/15 hover:border-teal-deep/50'
              }`}
            >
              {displayDay} {isToday && `(${language === 'en' ? 'Today' : 'आज'})`}
            </button>
          );
        })}
      </div>

      {/* Hourly Bars */}
      <div className="flex items-end gap-1 md:gap-1.5 h-36 border-b border-ink/10 pb-5 mb-5 relative select-none">
        {popularData[selectedDay].map((value, idx) => {
          const isCurrentHour = selectedDay === todayDayName && idx === Math.min(Math.max(currentHour - 9, 0), 12);
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip */}
              {value > 0 && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-teal-deep text-sand-light text-[9px] font-bold py-0.5 px-1.5 rounded transition-transform duration-200 pointer-events-none z-10 whitespace-nowrap shadow-md">
                  {value}%
                </div>
              )}

              {/* Bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(value, 4)}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className={`w-full rounded-t-sm transition-all duration-300 relative ${colorFor(value)} ${
                  isCurrentHour ? 'outline-2 outline-teal-deep outline-offset-1 ring-1 ring-teal-deep' : ''
                }`}
              >
                {isCurrentHour && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal-deep animate-ping" />
                )}
              </motion.div>

              {/* Label */}
              <span className="absolute -bottom-5 text-[9px] font-medium text-ink/40 tracking-tight">
                {labels[idx]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[11px] font-semibold text-ink/70 flex-wrap mb-4 pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-ok" />
          {t('legendQuiet')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-busy" />
          {t('legendModerate')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded bg-full" />
          {t('legendBusy')}
        </span>
      </div>

      {/* Live Status Message */}
      <div 
        className="pt-4 border-t border-ink/10 text-xs text-ink/90"
        dangerouslySetInnerHTML={{ __html: getStatusText(selectedDay) }}
      />
    </div>
  );
};
export default PopularTimes;
