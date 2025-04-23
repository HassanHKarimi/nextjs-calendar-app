import { useRouter } from 'next/router';
import Link from 'next/link';

interface CalendarNavigationProps {
  currentView: 'month' | 'week' | 'day';
  onViewChange: (view: 'month' | 'week' | 'day') => void;
  authUser: any;
  onLogout: () => void;
}

export default function CalendarNavigation({ 
  currentView, 
  onViewChange, 
  authUser, 
  onLogout 
}: CalendarNavigationProps) {
  return (
    <div className="calendar-navigation">
      <h1 className="calendar-navigation-title">Your Calendar</h1>

      <div className="calendar-navigation-controls">
        <div className="view-switcher">
          <button 
            onClick={() => onViewChange('month')}
            className={`view-button ${currentView === 'month' ? 'view-button-active' : 'view-button-inactive'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Month
          </button>
          <button 
            onClick={() => onViewChange('week')}
            className={`view-button ${currentView === 'week' ? 'view-button-active' : 'view-button-inactive'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Week
          </button>
          <button 
            onClick={() => onViewChange('day')}
            className={`view-button ${currentView === 'day' ? 'view-button-active' : 'view-button-inactive'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Day
          </button>
        </div>

        <button
          onClick={() => {
            // Handle new event creation
            const router = useRouter();
            router.push('/calendar/event/new');
          }}
          className="new-event-button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Event
        </button>

        <div className="user-info">
          <span className="user-name">
            Logged in as {authUser?.name || 'User'}
          </span>
          <button
            onClick={onLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 