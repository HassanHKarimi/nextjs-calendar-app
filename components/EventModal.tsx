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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);

    // Create GSAP context for better cleanup
    const ctx = gsap.context(() => {
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
    }, containerRef); // scope animations to container

    return () => {
      window.removeEventListener('keydown', handleEscape);
      ctx.revert(); // cleanup all animations
    };
  }, [event.id]);

  const handleClose = () => {
    if (!modalRef.current || !overlayRef.current) return;

    const ctx = gsap.context(() => {
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
    }, containerRef);
  };

  // Calculate modal position based on event position
  const modalStyle: CSSProperties = position ? getModalPosition(position) : {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50"
      />
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
  const padding = 20; // padding from edges
  const monthGrid = document.querySelector('.month-grid');
  const monthGridRect = monthGrid?.getBoundingClientRect();
  const eventElement = document.elementFromPoint(position.x, position.y);
  const eventRect = eventElement?.getBoundingClientRect();
  
  if (!monthGridRect || !eventRect) {
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }

  // Get the clicked event's position relative to the month grid
  const relativeX = position.x - monthGridRect.left;
  const relativeY = position.y - monthGridRect.top;
  
  // Determine if we're in the right half of the grid
  const isRightHalf = relativeX > monthGridRect.width / 2;
  
  let left: number;
  let top: number;

  // Calculate horizontal position to avoid covering the event
  if (isRightHalf) {
    // If on right half, position modal to the left of the event
    left = Math.max(
      monthGridRect.left + padding,
      eventRect.left - modalWidth - padding
    );
  } else {
    // If on left half, position modal to the right of the event
    left = Math.min(
      monthGridRect.right - modalWidth - padding,
      eventRect.right + padding
    );
  }

  // Calculate vertical position to avoid covering the event
  const spaceAbove = eventRect.top - monthGridRect.top;
  const spaceBelow = monthGridRect.bottom - eventRect.bottom;
  
  if (spaceBelow >= modalHeight + padding) {
    // Enough space below the event
    top = eventRect.bottom + padding;
  } else if (spaceAbove >= modalHeight + padding) {
    // Enough space above the event
    top = eventRect.top - modalHeight - padding;
  } else {
    // Not enough space above or below, align with event
    top = Math.max(
      monthGridRect.top + padding,
      Math.min(
        monthGridRect.bottom - modalHeight - padding,
        eventRect.top
      )
    );
  }

  // Ensure modal stays within viewport bounds
  top = Math.max(padding, Math.min(window.innerHeight - modalHeight - padding, top));
  left = Math.max(padding, Math.min(window.innerWidth - modalWidth - padding, left));

  return {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`,
    maxHeight: `${window.innerHeight - 2 * padding}px`,
    overflowY: 'auto'
  };
} 