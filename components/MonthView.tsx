import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format } from 'date-fns';
import { Event, filterEventsForDay } from '@/utils/event/event-utils';
import CalendarDayCell from './ui/CalendarDayCell';

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, events, onEventClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "EEE";
  const rows: React.ReactNode[] = [];
  
  // Generate header with day names
  const days: React.ReactNode[] = [];
  let day = startDate;
  
  for (let i = 0; i < 7; i++) {
    days.push(
      <div key={i} className="month-day-header">
        {format(addDays(day, i), dateFormat)}
      </div>
    );
  }

  // Generate weeks
  let dates: React.ReactNode[] = [];
  day = startDate;
  
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = new Date(day);
      const dayEvents = filterEventsForDay(events, cloneDay);
      
      dates.push(
        <div key={day.toString()} className="month-day-container">
          <CalendarDayCell 
            day={cloneDay} 
            currentMonth={monthStart} 
            events={dayEvents}
            onEventClick={onEventClick}
          />
        </div>
      );
      
      day = addDays(day, 1);
    }
    
    rows.push(
      <div key={day.toString()} className="month-row">
        {dates}
      </div>
    );
    
    dates = [];
  }

  return (
    <div className="month-view">
      <div className="month-header">
        {days}
      </div>
      <div className="month-body">
        {rows}
      </div>
    </div>
  );
};

export default MonthView; 