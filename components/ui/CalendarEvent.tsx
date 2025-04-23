import React from 'react';
import { Event, getEventColorClass } from '../../utils/event/event-utils';

export interface CalendarEventProps {
  event: Event;
  onClick?: (event: Event) => void;
  isCompact?: boolean;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ 
  event, 
  onClick,
  isCompact = false
}) => {
  const colorClass = getEventColorClass(event.title);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  };

  const eventTime = () => {
    const start = new Date(event.start);
    const hour = start.getHours();
    const minute = start.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const formattedMinute = minute.toString().padStart(2, '0');
    
    return `${formattedHour}:${formattedMinute} ${ampm}`;
  };
  
  if (isCompact) {
    return (
      <div 
        className={`px-1 py-0.5 mb-1 text-xs rounded cursor-pointer border-l-4 truncate transition-all duration-200 ${colorClass}`}
        onClick={handleClick}
      >
        <span className="font-medium">{event.title}</span>
      </div>
    );
  }
  
  return (
    <div 
      className={`px-2 py-1 mb-1 text-sm rounded cursor-pointer border-l-4 truncate transition-all duration-200 transform hover:scale-[1.02] hover:shadow-sm ${colorClass}`}
      onClick={handleClick}
    >
      <div className="font-medium">{event.title}</div>
      <div className="text-xs opacity-75">{eventTime()}</div>
    </div>
  );
};

export default CalendarEvent; 