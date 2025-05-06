import React, { useState, useRef, useCallback } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isToday } from 'date-fns';
import { Event, filterEventsForDay } from '@/utils/event/event-utils';
import CalendarDayCell from './ui/CalendarDayCell';
import gsap from 'gsap';
import CalendarEvent from './ui/CalendarEvent';
import EventModal from './EventModal';

interface MonthViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event, clickEvent: React.MouseEvent) => void;
  eventRefs: React.MutableRefObject<{ [key: string]: any }>;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, events, onEventClick, eventRefs }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<Event | null>(null);
  const [pendingClickEvent, setPendingClickEvent] = useState<React.MouseEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const modalTitlePlaceholderRef = useRef<HTMLDivElement>(null);
  const [animatingEventId, setAnimatingEventId] = useState<string | null>(null);
  const [modalRef, setModalRef] = useState<any>(null);
  const [modalTitleVisible, setModalTitleVisible] = useState(false);
  const [modalBodyVisible, setModalBodyVisible] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const handleEventClick = (event: Event, clickEvent: React.MouseEvent) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimatingEventId(event.id);
    setPendingEvent(event);
    setPendingClickEvent(clickEvent);
    setShowModal(true);
  };

  // Effect to trigger animation when modal and refs are ready
  React.useEffect(() => {
    if (!isAnimating || !pendingEvent || !showModal) return;
    setModalTitleVisible(false); // Hide modal title before animation
    setModalBodyVisible(false); // Hide modal body before animation
    const eventRefObj = eventRefs.current[pendingEvent.id];
    const eventTitleNode = eventRefObj?.titleNode as HTMLElement | null;
    const modalTitleNode = modalRef?.titleNode as HTMLElement | null;
    if (!eventTitleNode) {
      return;
    }
    if (!modalTitleNode) {
      return;
    }
    // Helper to check if a rect is valid
    const isValidRect = (rect: DOMRect) => rect.width > 0 && rect.height > 0;
    // Animation function with retry
    let tries = 0;
    const animate = () => {
      const eventRect = eventTitleNode.getBoundingClientRect();
      const modalRect = modalTitleNode.getBoundingClientRect();
      if (
        (eventRect.left === 0 && eventRect.top === 0 && eventRect.width === 0 && eventRect.height === 0) ||
        (modalRect.left === 0 && modalRect.top === 0 && modalRect.width === 0 && modalRect.height === 0)
      ) {
        setIsAnimating(false);
        setAnimatingEventId(null);
        return;
      }
      if (!isValidRect(eventRect) || !isValidRect(modalRect)) {
        if (tries < 3) {
          tries++;
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          setAnimatingEventId(null);
        }
        return;
      }
      // Create a clone of the event title
      const clone = eventTitleNode.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.left = `${eventRect.left}px`;
      clone.style.top = `${eventRect.top}px`;
      clone.style.width = `${eventRect.width}px`;
      clone.style.height = `${eventRect.height}px`;
      clone.style.zIndex = '1000';
      clone.style.pointerEvents = 'none';
      clone.style.margin = '0';
      clone.style.transition = 'none';
      // Copy all relevant computed styles for pixel-perfect match (from event title)
      const computedEvent = window.getComputedStyle(eventTitleNode);
      clone.style.font = computedEvent.font;
      clone.style.fontSize = computedEvent.fontSize;
      clone.style.fontWeight = computedEvent.fontWeight;
      clone.style.padding = computedEvent.padding;
      clone.style.margin = computedEvent.margin;
      clone.style.letterSpacing = computedEvent.letterSpacing;
      clone.style.lineHeight = computedEvent.lineHeight;
      clone.style.color = computedEvent.color;
      clone.style.boxSizing = computedEvent.boxSizing;
      clone.style.verticalAlign = computedEvent.verticalAlign;
      clone.style.border = computedEvent.border;
      clone.style.borderRadius = computedEvent.borderRadius;
      // Copy modal title styles to clone before animating to modal
      const computedModal = window.getComputedStyle(modalTitleNode);
      setTimeout(() => {
        clone.style.font = computedModal.font;
        clone.style.fontSize = computedModal.fontSize;
        clone.style.fontWeight = computedModal.fontWeight;
        clone.style.padding = computedModal.padding;
        clone.style.margin = computedModal.margin;
        clone.style.letterSpacing = computedModal.letterSpacing;
        clone.style.lineHeight = computedModal.lineHeight;
        clone.style.color = computedModal.color;
        clone.style.boxSizing = computedModal.boxSizing;
        clone.style.verticalAlign = computedModal.verticalAlign;
        clone.style.border = computedModal.border;
        clone.style.borderRadius = computedModal.borderRadius;
      }, 0);
      document.body.appendChild(clone);
      setAnimatingEventId(pendingEvent.id);
      gsap.to(clone, {
        x: modalRect.left - eventRect.left,
        y: modalRect.top - eventRect.top,
        width: modalRect.width,
        height: modalRect.height,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          document.body.removeChild(clone);
          setModalTitleVisible(true); // Show modal title at the exact moment animation ends
          setModalBodyVisible(true); // Show modal body immediately after title lands
          setIsAnimating(false);
          setAnimatingEventId(null);
        }
      });
    };
    animate();
  }, [isAnimating, pendingEvent, showModal, modalRef, eventRefs]);

  // Log when modalRef is set
  React.useEffect(() => {
    if (modalRef) {
      console.log('[MonthView] modalRef set', { modalRef });
    }
  }, [modalRef]);

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
              eventRefs={eventRefs}
              animatingEventId={animatingEventId}
            />
          );
        })}
      </div>
      {showModal && pendingEvent && (
        <EventModal
          ref={setModalRef}
          event={pendingEvent}
          onClose={() => {
            setShowModal(false);
            setPendingEvent(null);
            setPendingClickEvent(null);
          }}
          titleVisible={modalTitleVisible}
          bodyVisible={modalBodyVisible}
          onOverlayClick={() => {
            setShowModal(false);
            setPendingEvent(null);
            setPendingClickEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default MonthView; 