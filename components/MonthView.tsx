import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isToday } from 'date-fns';
import { Event, filterEventsForDay } from '@/utils/event/event-utils';
import CalendarDayCell from './ui/CalendarDayCell';
import { motion, LayoutGroup } from 'framer-motion';

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event, clickEvent: React.MouseEvent) => void;
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
            onEventClick={(event, e) => onEventClick(event, e)}
            layoutIdPrefix={`event-${format(cloneDay, 'yyyy-MM-dd')}`}
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
    <LayoutGroup>
      <div className="month-container">
        <div className="month-grid">
          {/* Weekday headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="month-day-header">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {Array.from({ length: 42 }, (_, i) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - currentDate.getDay() + 1);
            const dayEvents = events.filter(event => {
              const eventDate = new Date(event.startDate);
              return eventDate.getDate() === date.getDate() &&
                     eventDate.getMonth() === date.getMonth() &&
                     eventDate.getFullYear() === date.getFullYear();
            });
            
            return (
              <CalendarDayCell
                key={date.toString()}
                day={date}
                currentMonth={currentDate}
                events={dayEvents}
                onEventClick={(event, e) => onEventClick(event, e)}
                layoutIdPrefix={`event-${format(date, 'yyyy-MM-dd')}`}
              />
            );
          })}
        </div>
      </div>
    </LayoutGroup>
  );
};

export default MonthView; 