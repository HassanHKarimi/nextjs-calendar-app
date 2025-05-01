import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isToday } from 'date-fns';
import { Event, filterEventsForDay } from '@/utils/event/event-utils';
import CalendarDayCell from './ui/CalendarDayCell';
import gsap from 'gsap';

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

  const handleEventClick = (event: Event, clickEvent: React.MouseEvent) => {
    const element = clickEvent.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const modalTitle = document.querySelector('.event-modal-title');
    
    if (modalTitle) {
      const modalRect = modalTitle.getBoundingClientRect();
      
      // Create a clone of the title for the animation
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.top = rect.top + 'px';
      clone.style.left = rect.left + 'px';
      clone.style.width = rect.width + 'px';
      clone.style.height = rect.height + 'px';
      clone.style.zIndex = '100';
      document.body.appendChild(clone);
      
      // Animate the clone to the modal title position
      gsap.to(clone, {
        top: modalRect.top,
        left: modalRect.left,
        width: modalRect.width,
        height: modalRect.height,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          clone.remove();
        }
      });
    }
    
    onEventClick(event, clickEvent);
  };

  return (
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
            const eventDate = event.start;
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
              onEventClick={(event, e) => handleEventClick(event, e)}
              layoutIdPrefix={`event-${format(date, 'yyyy-MM-dd')}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MonthView; 