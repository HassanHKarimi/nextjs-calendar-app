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

    // Find the source event title element
    const sourceElement = document.querySelector(`[data-event-id="${event.id}"]`);
    const sourceRect = sourceElement?.getBoundingClientRect();
    const targetElement = titleRef.current;
    
    if (sourceElement && sourceRect && targetElement) {
      // Set initial position to match source
      gsap.set(targetElement, {
        fontSize: window.getComputedStyle(sourceElement).fontSize,
        lineHeight: window.getComputedStyle(sourceElement).lineHeight,
        opacity: 0
      });
    }

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

      // Animate title if we have source and target
      if (sourceElement && sourceRect && targetElement) {
        tl.to(targetElement, {
          opacity: 1,
          fontSize: "1.5rem",
          duration: 0.3,
          ease: "power2.inOut"
        }, "-=0.2");
      }
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [event.id]);

  const handleClose = () => {
    if (!modalRef.current || !overlayRef.current) return;

    const tl = gsap.timeline();
    
    // Find the source event title element
    const sourceElement = document.querySelector(`[data-event-id="${event.id}"]`);
    const sourceRect = sourceElement?.getBoundingClientRect();
    const targetElement = titleRef.current;

    if (sourceElement && sourceRect && targetElement) {
      tl.to(targetElement, {
        fontSize: window.getComputedStyle(sourceElement).fontSize,
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
        className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4 relative"
        style={modalStyle}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
        <div>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2
              ref={titleRef}
              className="event-modal-title"
              style={{
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                color: '#1a1a1a'
              }}
            >
              {event.title}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {event.isAllDay ? (
                'All day'
              ) : (
                `${format(event.start, 'h:mm a')} - ${format(event.end, 'h:mm a')}`
              )}
            </p>
          </div>
          {event.description && (
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              {event.description}
            </p>
          )}
          {event.location && (
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              📍 {event.location}
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
  const monthGrid = document.querySelector('.month-grid');
  const monthGridRect = monthGrid?.getBoundingClientRect();
  
  if (!monthGridRect) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }

  // Calculate which quadrant the event is in
  const isInRightHalf = position.x > monthGridRect.left + monthGridRect.width / 2;
  const isInBottomHalf = position.y > monthGridRect.top + monthGridRect.height / 2;
  
  let top, left;
  
  if (isInRightHalf) {
    // Right side
    left = Math.min(position.x - modalWidth - 10, monthGridRect.right - modalWidth - 10);
  } else {
    // Left side
    left = Math.max(position.x + 10, monthGridRect.left + 10);
  }
  
  if (isInBottomHalf) {
    // Bottom half
    top = Math.min(position.y - modalHeight - 10, monthGridRect.bottom - modalHeight - 10);
  } else {
    // Top half
    top = Math.max(position.y + 10, monthGridRect.top + 10);
  }
  
  return {
    position: 'fixed',
    top: `${top}px`,
    left: `${left}px`
  };
} 