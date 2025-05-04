import React, { useState, useRef } from 'react';
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
  const [showModal, setShowModal] = useState(false);
  const modalTitlePlaceholderRef = useRef<HTMLDivElement>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handleEventClick = async (event: Event, clickEvent: React.MouseEvent) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPendingEvent(event);
    setPendingClickEvent(clickEvent);
    setShowModal(false);

    // Wait for the placeholder to render
    await new Promise(resolve => setTimeout(resolve, 10));
    const element = clickEvent.currentTarget as HTMLElement;
    const titleElement = element.querySelector('.event-title');
    const placeholder = modalTitlePlaceholderRef.current;
    if (!titleElement || !placeholder) {
      setIsAnimating(false);
      setPendingEvent(null);
      setPendingClickEvent(null);
      setShowModal(true);
      onEventClick(event, clickEvent);
      return;
    }
    const rect = titleElement.getBoundingClientRect();
    const modalRect = placeholder.getBoundingClientRect();
    // Clone the text node only
    const textClone = document.createElement('span');
    textClone.textContent = titleElement.textContent;
    textClone.style.position = 'fixed';
    textClone.style.top = rect.top + 'px';
    textClone.style.left = rect.left + 'px';
    textClone.style.width = rect.width + 'px';
    textClone.style.height = rect.height + 'px';
    textClone.style.font = window.getComputedStyle(titleElement).font;
    textClone.style.fontWeight = window.getComputedStyle(titleElement).fontWeight;
    textClone.style.fontSize = window.getComputedStyle(titleElement).fontSize;
    textClone.style.color = window.getComputedStyle(titleElement).color;
    textClone.style.background = 'transparent';
    textClone.style.zIndex = '10000';
    textClone.style.pointerEvents = 'none';
    textClone.style.paddingLeft = window.getComputedStyle(titleElement).paddingLeft;
    document.body.appendChild(textClone);
    await new Promise<void>(resolve => {
      gsap.to(textClone, {
        top: modalRect.top,
        left: modalRect.left,
        width: modalRect.width,
        height: modalRect.height,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          textClone.remove();
          resolve();
        }
      });
    });
    setIsAnimating(false);
    setPendingEvent(null);
    setPendingClickEvent(null);
    setShowModal(true);
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
      {isAnimating && (
        <div style={{position: 'fixed', top: '-9999px', left: '-9999px', opacity: 0, pointerEvents: 'none'}}>
          <div ref={modalTitlePlaceholderRef} className="event-modal-title">
            {pendingEvent?.title}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthView; 