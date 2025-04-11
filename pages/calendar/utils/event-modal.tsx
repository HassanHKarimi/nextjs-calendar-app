// pages/calendar/utils/event-modal.tsx
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Determine color class name from event color
  const getColorClass = () => {
    if (!event.color) return 'bg-gray-600';
    
    if (event.color.includes('blue')) return 'bg-blue-600';
    if (event.color.includes('green')) return 'bg-green-600';
    if (event.color.includes('red')) return 'bg-red-600';
    if (event.color.includes('purple')) return 'bg-purple-600';
    if (event.color.includes('yellow')) return 'bg-yellow-600';
    if (event.color.includes('indigo')) return 'bg-indigo-600';
    
    return 'bg-gray-600';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" 
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Event color indicator and title */}
        <div className="flex items-center mb-4">
          <div className={`h-10 w-2 rounded-full ${getColorClass()} mr-3`}></div>
          <h2 className="text-2xl font-bold text-gray-900">
            {event.title || "Untitled Event"}
          </h2>
        </div>

        {/* Date and time */}
        <div className="mt-6 space-y-4">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900">{eventData.dateDisplay}</div>
              <div className="text-gray-600">{eventData.timeDisplay}</div>
            </div>
          </div>

          {/* Location if available */}
          {event.location && (
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Location</div>
                <div className="text-gray-600">{event.location}</div>
              </div>
            </div>
          )}

          {/* Description if available */}
          {event.description && (
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Description</div>
                <div className="text-gray-600 whitespace-pre-line">{event.description}</div>
              </div>
            </div>
          )}

          {/* Warning for invalid dates */}
          {!eventData.hasValidDates && (
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This event has invalid date information. Please edit the event to fix this issue.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              // In a real implementation, this would navigate to edit view
              console.log("Edit event: ", event.id);
            }}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};