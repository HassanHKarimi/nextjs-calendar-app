import React, { useRef, useEffect, useState } from 'react';
import { Event as EventType } from '@/types/Event';
import { Event as EventUtilType } from '@/utils/event/event-utils';
import { format } from 'date-fns';
import SharedElementPortal from './animation/SharedElementPortal';

// Animation phases for the modal
type AnimationPhase = 'initial' | 'measuring' | 'animating' | 'visible';

// Enhanced event type that includes the source element
interface EnhancedEvent extends Partial<EventType>, Partial<EventUtilType> {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  start?: Date;
  end?: Date;
  isAllDay?: boolean;
  color?: string;
  sourceElement?: HTMLElement | null;
}

interface EventModalProps {
  event: EnhancedEvent | null;
  onClose: () => void;
  isOpen: boolean;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose, isOpen }) => {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('initial');
  const modalRef = useRef<HTMLDivElement>(null);
  const modalTitleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleCloneRef = useRef<HTMLDivElement>(null);
  
  // For debug purposes
  const [debug, setDebug] = useState({
    sourceRect: null as DOMRect | null,
    targetRect: null as DOMRect | null,
    isSourceElementAvailable: false,
    isTargetElementAvailable: false
  });
  
  // Reset animation phase when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAnimationPhase('initial');
      
      // Immediately move to measuring phase
      requestAnimationFrame(() => {
        setAnimationPhase('measuring');
      });
    } else {
      setAnimationPhase('initial');
    }
  }, [isOpen]);
  
  // After measuring phase, start animation
  useEffect(() => {
    if (animationPhase === 'measuring') {
      // Give time for components to render before starting animation
      const timer = setTimeout(() => {
        setAnimationPhase('animating');
      }, 20); // Reduced delay for more responsive animation start
      
      return () => clearTimeout(timer);
    }
  }, [animationPhase]);
  
  // Debug: Check element availability
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isOpen && event) {
      const sourceElement = event.sourceElement || null;
      const targetElement = modalTitleRef.current;
      
      const debugTimer = setInterval(() => {
        setDebug({
          sourceRect: sourceElement?.getBoundingClientRect() || null,
          targetRect: targetElement?.getBoundingClientRect() || null,
          isSourceElementAvailable: !!sourceElement && document.body.contains(sourceElement),
          isTargetElementAvailable: !!targetElement && document.body.contains(targetElement)
        });
      }, 500);
      
      return () => clearInterval(debugTimer);
    }
  }, [isOpen, event]);
  
  // Animation durations in seconds
  const ANIMATION_DURATIONS = {
    title: 0.3, // Duration of title animation
    contentFadeIn: 0.2, // Duration of content fade-in
    overlayFadeIn: 0.3 // Duration of overlay fade-in
  };
  
  // Handle animation complete
  const handleAnimationComplete = () => {
    // Set visibility state
    setAnimationPhase('visible');
    
    // Fade in content with synchronized timing and slight delay
    if (contentRef.current) {
      contentRef.current.style.opacity = '1';
      contentRef.current.style.transition = `opacity ${ANIMATION_DURATIONS.contentFadeIn}s ease-out`;
      
      // Apply subtle transform for better effect
      contentRef.current.style.transform = 'translateY(0)';
      contentRef.current.style.transition = `opacity ${ANIMATION_DURATIONS.contentFadeIn}s ease-out, transform ${ANIMATION_DURATIONS.contentFadeIn}s ease-out`;
    }
  };
  
  if (!event) return null;
  
  // Determine date display format based on whether it's an all-day event
  const formatDateDisplay = (date: Date | undefined) => {
    if (!date) return '';
    return (event.isAllDay) 
      ? format(date, 'MMM d, yyyy') 
      : format(date, 'MMM d, yyyy h:mm a');
  };
  
  // Prepare start and end dates, handling both possible formats
  const startDate = event.startDate || event.start;
  const endDate = event.endDate || event.end;
  
  // Determine if modal is ready to be displayed
  const isModalReady = animationPhase === 'visible' || animationPhase === 'animating';
  
  // Base modal classes
  const modalClasses = `fixed inset-0 z-50 flex items-center justify-center
                        ${isOpen ? 'visible' : 'hidden'}`;
  
  // Overlay classes with opacity transition
  const overlayClasses = `absolute inset-0 bg-black 
                          ${animationPhase === 'visible' ? 'opacity-50' : 'opacity-0'}
                          transition-opacity duration-300`;
  
  // Modal content classes with animation state
  const modalContentClasses = `bg-white rounded-lg shadow-xl p-6 w-full max-w-lg
                              relative z-10 transition-all duration-300
                              ${animationPhase === 'visible' ? 'scale-100' : 'scale-95'}`;
  
  return (
    <div 
      ref={modalRef}
      className={modalClasses}
      onClick={onClose}
      data-testid="event-modal"
      style={{ pointerEvents: isModalReady ? 'auto' : 'none' }}
    >
      {/* Overlay with fade transition */}
      <div 
        className={overlayClasses}
        aria-hidden="true"
        style={{
          transitionDuration: `${ANIMATION_DURATIONS.overlayFadeIn}s`,
          transitionDelay: `${animationPhase === 'visible' ? '0s' : '0.05s'}`
        }}
      />
      
      {/* Modal content */}
      <div 
        ref={contentRef}
        className={modalContentClasses}
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: animationPhase === 'visible' ? 1 : 0,
          transform: animationPhase === 'visible' ? 'translateY(0)' : 'translateY(8px)',
          transition: `opacity ${ANIMATION_DURATIONS.contentFadeIn}s ease-out, transform ${ANIMATION_DURATIONS.contentFadeIn}s ease-out`,
          transitionDelay: '0.03s' // Adjusted for smoother handoff after title animation
        }}
      >
        {/* Hidden title element that serves as animation target */}
        <h2 
          ref={modalTitleRef}
          className="text-xl font-semibold mb-4"
          style={{ 
            visibility: animationPhase === 'animating' ? 'hidden' : 'visible',
            position: 'relative',
            zIndex: 1,
            opacity: animationPhase === 'visible' ? 1 : 0,
            transform: animationPhase === 'visible' ? 'translateY(0)' : 'translateY(-4px)',
            transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
            transitionDelay: '0s' // No delay to ensure perfect synchronization with animation end
          }}
          data-id="modal-title"
        >
          {event.title}
        </h2>
        
        {/* Main content */}
        <div 
          className={`transition-opacity ${animationPhase === 'visible' ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            transitionDelay: '0.08s', // Slightly increased to ensure title is visible first
            transitionDuration: '0.25s'
          }}
        >
          {startDate && (
            <div className="mb-3">
              <span className="font-medium">Start: </span>
              <span>{formatDateDisplay(startDate)}</span>
            </div>
          )}
          
          {endDate && (
            <div className="mb-3">
              <span className="font-medium">End: </span>
              <span>{formatDateDisplay(endDate)}</span>
            </div>
          )}
          
          {event.location && (
            <div className="mb-3">
              <span className="font-medium">Location: </span>
              <span>{event.location}</span>
            </div>
          )}
          
          {event.description && (
            <div className="mb-3">
              <div className="font-medium mb-1">Description:</div>
              <p className="text-gray-700">{event.description}</p>
            </div>
          )}
          
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated shared element portal */}
      {animationPhase === 'animating' && (
        <SharedElementPortal
          sourceElement={event.sourceElement || null}
          targetElement={modalTitleRef.current}
          isActive={true}
          onAnimationComplete={handleAnimationComplete}
          duration={ANIMATION_DURATIONS.title}
          debug={process.env.NODE_ENV === 'development'}
        >
          <div 
            ref={titleCloneRef}
            style={{ 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%',
              textAlign: 'center',
              fontWeight: 600,
              padding: '4px'
            }}
          >
            {event.title}
          </div>
        </SharedElementPortal>
      )}
      
      {/* Debug information (only in development) */}
      {process.env.NODE_ENV === 'development' && false && (
        <div 
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '10px',
            zIndex: 9999,
            maxWidth: '300px',
            fontSize: '10px'
          }}
        >
          <div>Animation Phase: {animationPhase}</div>
          <div>Source Available: {debug.isSourceElementAvailable ? 'Yes' : 'No'}</div>
          <div>Target Available: {debug.isTargetElementAvailable ? 'Yes' : 'No'}</div>
          <div>Source Rect: {debug.sourceRect ? `${Math.round(debug.sourceRect!.width)}x${Math.round(debug.sourceRect!.height)} @ ${Math.round(debug.sourceRect!.left)},${Math.round(debug.sourceRect!.top)}` : 'N/A'}</div>
          <div>Target Rect: {debug.targetRect ? `${Math.round(debug.targetRect!.width)}x${Math.round(debug.targetRect!.height)} @ ${Math.round(debug.targetRect!.left)},${Math.round(debug.targetRect!.top)}` : 'N/A'}</div>
        </div>
      )}
    </div>
  );
};

export default EventModal; 