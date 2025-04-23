import { format } from 'date-fns';
import { useState } from 'react';
import { Event } from '@/types/Event';

interface CalendarEventProps {
  event: Event;
  onClick: (event: Event) => void;
  maxTitleLength?: number;
  showTime?: boolean;
  style?: React.CSSProperties;
}

export default function CalendarEvent({
  event,
  onClick,
  maxTitleLength = 18,
  showTime = false,
  style = {}
}: CalendarEventProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine event colors based on title content
  let eventColorClass = '';
  
  if (event.title.includes('Client Meeting')) {
    eventColorClass = 'bg-green-100 text-green-800';
  } else if (event.title.includes('Team Standup')) {
    eventColorClass = 'bg-red-100 text-red-800';
  } else if (event.title.includes('Project')) {
    eventColorClass = 'bg-red-100 text-red-800';
  } else if (event.title.includes('Design')) {
    eventColorClass = 'bg-purple-100 text-purple-800';
  } else if (event.title.includes('1:1')) {
    eventColorClass = 'bg-blue-100 text-blue-800';
  } else if (event.title.includes('Review')) {
    eventColorClass = 'bg-yellow-100 text-yellow-800';
  } else if (event.title.includes('UI/UX')) {
    eventColorClass = 'bg-yellow-100 text-yellow-800';
  } else if (event.title.includes('Team Meeting')) {
    eventColorClass = 'bg-blue-100 text-blue-800';
  } else if (event.title.includes('Product')) {
    eventColorClass = 'bg-blue-100 text-blue-800';
  } else if (event.title.includes('API')) {
    eventColorClass = 'bg-purple-100 text-purple-800';
  } else if (event.title.includes('Code')) {
    eventColorClass = 'bg-yellow-100 text-yellow-800';
  } else {
    eventColorClass = 'bg-blue-100 text-blue-800'; // Default
  }

  // Build title with optional time display
  const displayTitle = event.title.length > maxTitleLength 
    ? `${event.title.substring(0, maxTitleLength)}...` 
    : event.title;

  // Tooltip text
  const timeInfo = event.isAllDay 
    ? ' (All day)' 
    : ` (${format(new Date(event.startDate), 'h:mm a')} - ${format(new Date(event.endDate), 'h:mm a')})`;
  
  const tooltipText = `${event.title}${timeInfo}\n${event.description || ''}`;

  // Class names
  const eventClasses = `
    month-event 
    ${isHovered ? 'month-event-hover' : ''} 
    ${eventColorClass}
  `.trim();

  return (
    <div
      onClick={() => onClick(event)}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      className={eventClasses}
      title={tooltipText}
      style={style}
    >
      {displayTitle}
      {showTime && !event.isAllDay && (
        <div className="text-[10px] mt-0.5">
          {format(new Date(event.startDate), 'h:mm a')}
        </div>
      )}
    </div>
  );
} 