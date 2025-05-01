import React from 'react';
import { Event, getEventColorClass } from '../../utils/event/event-utils';
import { motion, LayoutGroup } from 'framer-motion';

export interface CalendarEventProps {
  event: Event;
  onClick?: (event: React.MouseEvent) => void;
  isCompact?: boolean;
  layoutId?: string;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ 
  event, 
  onClick,
  isCompact = false,
  layoutId
}) => {
  const colorClass = getEventColorClass(event.title);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
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
      <motion.div 
        layoutId={layoutId}
        className={`px-1 py-1 mb-1 text-xs rounded cursor-pointer truncate transition-all duration-200 
                   transform hover:scale-[1.02] hover:shadow-sm z-[1] hover:z-[10] ${colorClass}`}
        onClick={handleClick}
      >
        <motion.span 
          layoutId={`${layoutId}-title`} 
          className="font-medium"
        >
          {event.title}
        </motion.span>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      layoutId={layoutId}
      className={`px-2 py-1 mb-1 text-sm rounded cursor-pointer truncate transition-all duration-200 
                 transform hover:scale-[1.02] hover:shadow-md z-[1] hover:z-[10] ${colorClass}`}
      onClick={handleClick}
    >
      <motion.div 
        layoutId={`${layoutId}-title`} 
        className="font-medium"
      >
        {event.title}
      </motion.div>
      <motion.div 
        layoutId={`${layoutId}-time`} 
        className="text-xs opacity-75"
      >
        {eventTime()}
      </motion.div>
    </motion.div>
  );
};

export default CalendarEvent; 