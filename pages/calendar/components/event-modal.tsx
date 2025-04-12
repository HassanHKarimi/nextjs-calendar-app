// pages/calendar/components/event-modal.tsx
import { format, isValid } from "date-fns";
import { useState, useEffect } from "react";

interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  location?: string;
  isAllDay?: boolean;
  color: string;
  userId?: string;
}

type EventModalProps = {
  event: Event;
  onClose: () => void;
};

export const EventModal = ({ event, onClose }: EventModalProps) => {
  // Add state to track if modal is ready to display (to prevent flash of incorrect content)
  const [isReady, setIsReady] = useState(false);
  const [eventData, setEventData] = useState<{
    startDate: Date;
    endDate: Date;
    dateDisplay: string;
    timeDisplay: string;
    hasValidDates: boolean;
  }>({
    startDate: new Date(),
    endDate: new Date(),
    dateDisplay: "Loading...",
    timeDisplay: "Loading...",
    hasValidDates: false
  });

  // Handle ESC key to close the modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    
    // Parse and validate dates immediately on mount
    parseEventDates();
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Safely parse event dates
  const parseEventDates = () => {
    if (!event) return;
    
    try {
      // First, check if the dates are already Date objects
      let startDate: Date;
      let endDate: Date;
      
      if (event.startDate instanceof Date) {
        startDate = event.startDate;
      } else {
        startDate = new Date(event.startDate);
      }
      
      if (event.endDate instanceof Date) {
        endDate = event.endDate;
      } else {
        endDate = new Date(event.endDate);
      }
      
      // Check if dates are valid
      const hasValidDates = isValid(startDate) && isValid(endDate);
      
      if (!hasValidDates) {
        throw new Error("Invalid date format");
      }
      
      // Format date and time
      const dateDisplay = format(startDate, "EEEE, MMMM d, yyyy");
      const timeDisplay = event.isAllDay
        ? "All Day"
        : `${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`;
      
      setEventData({
        startDate,
        endDate,
        dateDisplay,
        timeDisplay,
        hasValidDates
      });
    } catch (error) {
      console.error("Error formatting event dates:", error);
      
      // Set fallback values
      setEventData({
        startDate: new Date(),
        endDate: new Date(),
        dateDisplay: "Date information unavailable",
        timeDisplay: "Time information unavailable",
        hasValidDates: false
      });
    } finally {
      // Mark modal as ready to display
      setIsReady(true);
    }
  };

  // Don't render anything if event is null
  if (!event) return null;

  // Don't render content until dates have been parsed
  if (!isReady) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Determine color class name from event color
  const getColorClass = () => {
    if (!event.color) return 'bg-gray-500';
    
    if (event.color.includes('blue')) return 'bg-blue-500';
    if (event.color.includes('green')) return 'bg-green-500';
    if (event.color.includes('red')) return 'bg-red-500';
    if (event.color.includes('purple')) return 'bg-purple-500';
    if (event.color.includes('yellow')) return 'bg-yellow-500';
    if (event.color.includes('indigo')) return 'bg-indigo-500';
    if (event.color.includes('pink')) return 'bg-pink-500';
    
    return 'bg-gray-500';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" 
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md rounded-lg bg-white/90 dark:bg-gray-900/90 p-6 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-filter backdrop-blur-md before:content-[''] before:absolute before:inset-0 before:bg-noise-pattern before:opacity-5 before:mix-blend-overlay">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Event color indicator */}
        <div className={`mb-4 h-2 w-16 rounded ${getColorClass()}`} />

        {/* Event title */}
        <h2 className="text-2xl font-bold">
          {event.title || "Untitled Event"}
        </h2>

        {/* Date and time */}
        <div className="mt-4 space-y-2">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <div className="font-medium">{eventData.dateDisplay}</div>
              <div className="text-sm text-gray-600">{eventData.timeDisplay}</div>
            </div>
          </div>

          {/* Location if available */}
          {event.location && (
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="font-medium">{event.location}</div>
            </div>
          )}

          {/* User ID if available (for admin views) */}
          {event.userId && (
            <div className="flex items-start mt-2 text-xs text-gray-500">
              <span>ID: {event.userId}</span>
            </div>
          )}
        </div>

        {/* Description if available */}
        {event.description && (
          <div className="mt-6">
            <h3 className="mb-2 font-semibold">Description</h3>
            <p className="whitespace-pre-line text-gray-700">{event.description}</p>
          </div>
        )}

        {/* Warning for invalid dates */}
        {!eventData.hasValidDates && (
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This event has invalid date information. Please edit the event to fix this issue.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              // In a real implementation, this would navigate to edit view
              console.log("Edit event: ", event.id);
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit (Demo)
          </button>
        </div>
      </div>
    </div>
  );
};