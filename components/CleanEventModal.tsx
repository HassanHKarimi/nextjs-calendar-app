import React, { useRef, useEffect, useState } from 'react';
import { Event as EventType } from '@/types/Event';
import { format } from 'date-fns';
import CleanSharedElementPortal from './animation/CleanSharedElementPortal';
import { getAnimationConfig } from './animation/cleanAnimationConfig';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register the useGSAP hook
gsap.registerPlugin(useGSAP);

type AnimationPhase = 'hidden' | 'animating' | 'visible';

interface CleanEventModalProps {
  event: EventType & { sourceElement?: HTMLElement };
  onClose: () => void;
  isOpen: boolean;
  customConfig?: typeof getAnimationConfig extends () => infer R ? R : never;
}

const CleanEventModal: React.FC<CleanEventModalProps> = ({ event, onClose, isOpen, customConfig }) => {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('hidden');
  const modalRef = useRef<HTMLDivElement>(null);
  const modalTitleRef = useRef<HTMLHeadingElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get animation config (respects reduced motion preferences)
  const animConfig = customConfig || getAnimationConfig();

  // Format dates for display
  const formatDateDisplay = (date: Date) => {
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const startDate = event.startDate ? new Date(event.startDate) : null;
  const endDate = event.endDate ? new Date(event.endDate) : null;

  // Handle animation completion
  const handleAnimationComplete = () => {
    setShowModalTitle(true);
    setAnimationPhase('visible');
    
    // Restore source element visibility
    if (event.sourceElement) {
      event.sourceElement.style.opacity = '1';
    }
  };

  // Coordinate modal title visibility with shared element animation
  const [showModalTitle, setShowModalTitle] = useState(false);
  
  // Timer-based logic removed - now handled by animation completion

  // Handle modal close with animation
  const handleClose = () => {
    setAnimationPhase('hidden');
    onClose();
  };

  // Reset states when modal opens/closes
  const [showModalContainer, setShowModalContainer] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setAnimationPhase('animating');
      setShowModalTitle(false);
      setShowModalContainer(true); // Show immediately so target element exists
      
      // Hide source element during animation
      if (event.sourceElement) {
        event.sourceElement.style.opacity = '0';
      }
      
      // Delay overlay appearance slightly
      const overlayTimer = setTimeout(() => {
        setShowOverlay(true);
      }, 150); // Small delay for overlay
      
      return () => clearTimeout(overlayTimer);
    } else {
      setAnimationPhase('hidden');
      setShowModalTitle(false);
      setShowModalContainer(false);
      setShowOverlay(false);
      
      // Restore source element visibility
      if (event.sourceElement) {
        event.sourceElement.style.opacity = '1';
      }
    }
  }, [isOpen, event.sourceElement]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div ref={modalRef}>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
        style={{ opacity: showOverlay ? 1 : 0 }}
      />

      {/* Modal Container - Show during animation */}
      {showModalContainer && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            ref={contentRef}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative"
            style={{ 
              opacity: showOverlay ? 1 : 0, // Hide until overlay shows
              transform: 'scale(1)',
              transition: 'opacity 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title - Target for animation */}
            <div className="p-6 border-b border-gray-200">
              <h2 
                ref={modalTitleRef}
                className="text-xl font-semibold text-gray-900"
                style={{
                  opacity: showModalTitle ? 1 : 0, // Start completely hidden, then immediately visible
                  transition: showModalTitle ? 'none' : 'opacity 0.15s ease-out' // No transition when showing, smooth when hiding
                }}
              >
                {event.title}
              </h2>
            </div>

            {/* Modal Content */}
            <div 
              className="p-6"
              style={{
                opacity: 1, // Always visible for debugging
                transition: 'opacity 0.3s ease-out 0.1s'
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
                  onClick={handleClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shared Element Animation */}
      {animationPhase === 'animating' && event.sourceElement && (
        <CleanSharedElementPortal
          sourceElement={event.sourceElement || null}
          targetElement={modalTitleRef.current}
          isActive={true}
          onAnimationComplete={handleAnimationComplete}
          duration={animConfig.sharedElement.duration}
          easing={animConfig.sharedElement.easing}
        >
          <div 
            style={{ 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: 'fit-content',
              textAlign: 'left',
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '28px',
              margin: 0,
              padding: 0,
              display: 'inline-block'
            }}
          >
            {event.title}
          </div>
        </CleanSharedElementPortal>
      )}
    </div>
  );
};

export default CleanEventModal; 