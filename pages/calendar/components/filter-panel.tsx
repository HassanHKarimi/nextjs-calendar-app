// pages/calendar/components/filter-panel.tsx
import { useState } from 'react';

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface FilterState {
  eventTypes: Record<string, boolean>;
  tags: Record<string, boolean>;
  participants: Record<string, boolean>;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  showCompleted: boolean;
}

const defaultFilters: FilterState = {
  eventTypes: {
    meeting: true,
    appointment: true,
    reminder: true,
    task: true,
    holiday: true
  },
  tags: {
    work: true,
    personal: true,
    important: true,
    travel: true
  },
  participants: {
    'alex.johnson': true,
    'sarah.williams': true,
    'john.smith': true
  },
  dateRange: {
    startDate: null,
    endDate: null
  },
  showCompleted: true
};

export const FilterPanel = ({ onFilterChange, isOpen, onClose }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  
  // Toggle event type filter
  const toggleEventType = (type: string) => {
    setFilters(prev => {
      const newState = {
        ...prev,
        eventTypes: {
          ...prev.eventTypes,
          [type]: !prev.eventTypes[type]
        }
      };
      onFilterChange(newState);
      return newState;
    });
  };
  
  // Toggle tag filter
  const toggleTag = (tag: string) => {
    setFilters(prev => {
      const newState = {
        ...prev,
        tags: {
          ...prev.tags,
          [tag]: !prev.tags[tag]
        }
      };
      onFilterChange(newState);
      return newState;
    });
  };
  
  // Toggle participant filter
  const toggleParticipant = (participant: string) => {
    setFilters(prev => {
      const newState = {
        ...prev,
        participants: {
          ...prev.participants,
          [participant]: !prev.participants[participant]
        }
      };
      onFilterChange(newState);
      return newState;
    });
  };
  
  // Toggle show completed events
  const toggleShowCompleted = () => {
    setFilters(prev => {
      const newState = {
        ...prev,
        showCompleted: !prev.showCompleted
      };
      onFilterChange(newState);
      return newState;
    });
  };
  
  // Reset all filters to default
  const resetFilters = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-lg overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Calendar Filters</h2>
            <button 
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Event Types Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Event Types
            </h3>
            <div className="space-y-3">
              {Object.entries(filters.eventTypes).map(([type, isChecked]) => (
                <label key={type} className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={() => toggleEventType(type)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  />
                  <span className="text-gray-700 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Tags Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters.tags).map(([tag, isActive]) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    isActive 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-600 opacity-60'
                  }`}
                >
                  # {tag}
                </button>
              ))}
              <button className="rounded-full px-3 py-1 text-sm bg-gray-100 text-gray-600 border border-dashed border-gray-300">
                + Add Tag
              </button>
            </div>
          </div>
          
          {/* Participants Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Participants
            </h3>
            <div className="space-y-3">
              {Object.entries(filters.participants).map(([participant, isChecked]) => {
                const [firstName, lastName] = participant.split('.');
                const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
                const fullName = `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`;
                
                return (
                  <label key={participant} className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isChecked} 
                      onChange={() => toggleParticipant(participant)}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    />
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium mr-2">
                        {initials}
                      </div>
                      <span className="text-gray-700">{fullName}</span>
                    </div>
                  </label>
                );
              })}
            </div>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Participant
            </button>
          </div>
          
          {/* Date Range Section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Date Range
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input 
                  type="date" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input 
                  type="date" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Additional Filters */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Additional Filters
            </h3>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.showCompleted} 
                onChange={toggleShowCompleted}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-gray-700">Show completed events</span>
            </label>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button 
              onClick={resetFilters}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Reset Filters
            </button>
            <button 
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};