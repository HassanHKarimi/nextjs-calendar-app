import React, { useState } from 'react';
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<Event | null>(null);
  const [pendingClickEvent, setPendingClickEvent] = useState<React.MouseEvent | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handleEventClick = async (event: Event, clickEvent: React.MouseEvent) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPendingEvent(event);
    setPendingClickEvent(clickEvent);

    const element = clickEvent.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    // Find where the modal title will be (simulate or use a placeholder)
    // For now, animate to center of screen as a fallback
    const modalTarget = document.createElement('div');
    modalTarget.style.position = 'fixed';
    modalTarget.style.top = '50%';
    modalTarget.style.left = '50%';
    modalTarget.style.width = rect.width + 'px';
    modalTarget.style.height = rect.height + 'px';
    modalTarget.style.zIndex = '10000';
    modalTarget.style.pointerEvents = 'none';
    document.body.appendChild(modalTarget);
    const modalRect = modalTarget.getBoundingClientRect();

    // Create a clone of the title for the animation
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.top = rect.top + 'px';
    clone.style.left = rect.left + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.zIndex = '10000';
    clone.style.pointerEvents = 'none';
    document.body.appendChild(clone);

    await new Promise<void>(resolve => {
      gsap.to(clone, {
        top: modalRect.top,
        left: modalRect.left,
        width: modalRect.width,
        height: modalRect.height,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          clone.remove();
          modalTarget.remove();
          resolve();
        }
      });
    });

    setIsAnimating(false);
    setPendingEvent(null);
    setPendingClickEvent(null);
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