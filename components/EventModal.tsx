import { Event } from '@/utils/event/event-utils';
import { format } from 'date-fns';
import { useEffect, useRef, CSSProperties } from 'react';
import gsap from 'gsap';

interface EventModalProps {
  event: Event;
  onClose: () => void;
  position?: { x: number; y: number };
  layoutId?: string;
}

export default function EventModal({ event, onClose, position, layoutId }: EventModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);

    // Animate modal in
    if (overlayRef.current && modalRef.current) {
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(modalRef.current, { 
        opacity: 0,
        scale: 0.95,
        y: 20
      });
      
      const tl = gsap.timeline();
      
      // Fade in overlay
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out"
      });

      // Animate in modal
      tl.to(modalRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.7)"
      }, "-=0.1");

      // Set initial title opacity to 0
      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 0 });
        // Fade in title after animation completes
        tl.to(titleRef.current, {
          opacity: 1,
          duration: 0.2,
          delay: 0.3
        });
      }
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [event.id]);

  const handleClose = () => {
    if (!modalRef.current || !overlayRef.current) return;

    const tl = gsap.timeline();
    
    if (titleRef.current) {
      tl.to(titleRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in"
      });
    }

    tl.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 0.2,
      ease: "power2.in"
    }, "-=0.1")
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: onClose
    }, "-=0.1");
  };

  // Calculate modal position based on event position
  const modalStyle: CSSProperties = position ? getModalPosition(position) : {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="event-modal"
        style={modalStyle}
        onClick={e => e.stopPropagation()}
        data-layout-id={layoutId}
      >
        <button
          onClick={handleClose}
          className="event-modal-close"
          aria-label="Close modal"
        >
          ×
        </button>
        
        <div>
          <h2
            ref={titleRef}
            className="event-modal-title"
            data-event-id={event.id}
          >
            {event.title}
          </h2>
          <p className="event-modal-time">
            {event.isAllDay ? (
              'All day'
            ) : (
              `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`
            )}
          </p>
          {event.description && (
            <p className="event-modal-description">
              {event.description}
            </p>
          )}
          {event.location && (
            <p className="event-modal-location">
              <span>📍</span>
              <span>{event.location}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate modal position
function getModalPosition(position: { x: number; y: number }): CSSProperties {
  const modalWidth = 500; // max-width of modal
  const modalHeight = 400; // approximate height
  const padding = 20; // padding from viewport edges
  
  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Calculate initial position
  let left = position.x;
  let top = position.y;
  
  // Adjust horizontal position if modal would overflow
  if (left + modalWidth + padding > viewportWidth) {
    left = Math.max(padding, left - modalWidth);
  }
  
  // Adjust vertical position if modal would overflow
  if (top + modalHeight + padding > viewportHeight) {
    top = Math.max(padding, top - modalHeight);
  }
  
  return {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`
  };
} 