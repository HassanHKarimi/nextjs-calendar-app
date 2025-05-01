import React, { useRef, useEffect } from 'react';
import { Event, getEventColorClass } from '../../utils/event/event-utils';
import gsap from 'gsap';

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
  const eventRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const colorClass = getEventColorClass(event.title);
  
  useEffect(() => {
    const element = eventRef.current;
    if (!element) return;

    // Set up hover animations
    const enterAnimation = () => {
      gsap.to(element, {
        scale: 1.02,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: 10,
        duration: 0.2,
        ease: 'power2.out'
      });
    };

    const leaveAnimation = () => {
      gsap.to(element, {
        scale: 1,
        boxShadow: 'none',
        zIndex: 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    };

    element.addEventListener('mouseenter', enterAnimation);
    element.addEventListener('mouseleave', leaveAnimation);

    return () => {
      element.removeEventListener('mouseenter', enterAnimation);
      element.removeEventListener('mouseleave', leaveAnimation);
      gsap.killTweensOf(element);
    };
  }, []);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      const titleElement = titleRef.current;
      if (titleElement) {
        // Create a clone of the title for animation
        const clone = titleElement.cloneNode(true) as HTMLElement;
        const rect = titleElement.getBoundingClientRect();
        
        // Style the clone
        Object.assign(clone.style, {
          position: 'fixed',
          top: `${rect.top}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          zIndex: '1000',
          transformOrigin: 'left top',
          pointerEvents: 'none',
          backgroundColor: window.getComputedStyle(titleElement).backgroundColor,
          borderRadius: window.getComputedStyle(titleElement).borderRadius,
          padding: window.getComputedStyle(titleElement).padding
        });

        // Add the clone to the body
        document.body.appendChild(clone);

        // Trigger the click handler with the clone element
        onClick(e);

        // Clean up the clone after animation completes
        gsap.to(clone, {
          opacity: 0,
          duration: 0.3,
          delay: 0.3,
          onComplete: () => clone.remove()
        });
      } else {
        onClick(e);
      }
    }
  };

  const eventTime = () => {
    const start = event.start;
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
        ref={eventRef}
        onClick={handleClick}
        className={`calendar-event compact ${colorClass}`}
        data-layout-id={layoutId}
      >
        <div 
          ref={titleRef} 
          className="event-title"
          data-event-id={event.id}
        >
          {event.title}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      ref={eventRef}
      onClick={handleClick}
      className={`calendar-event ${colorClass}`}
      data-layout-id={layoutId}
    >
      <div 
        ref={titleRef} 
        className="event-title"
        data-event-id={event.id}
      >
        {event.title}
      </div>
      <div className="event-time">
        {eventTime()}
      </div>
      {event.location && (
        <div className="event-location">
          📍 {event.location}
        </div>
      )}
    </div>
  );
};

export default CalendarEvent; 