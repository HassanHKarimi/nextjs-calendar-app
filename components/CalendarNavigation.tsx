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
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Your Calendar</h1>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem' 
      }}>
        <div style={{
          display: 'flex',
          backgroundColor: '#f3f4f6',
          borderRadius: '16px',
          padding: '4px'
        }}>
          <button 
            onClick={() => onViewChange('month')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: currentView === 'month' ? '#111827' : 'transparent',
              color: currentView === 'month' ? 'white' : '#111827',
              borderRadius: '12px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
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
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: currentView === 'week' ? '#111827' : 'transparent',
              color: currentView === 'week' ? 'white' : '#111827',
              borderRadius: '12px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
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
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: currentView === 'day' ? '#111827' : 'transparent',
              color: currentView === 'day' ? 'white' : '#111827',
              borderRadius: '12px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
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
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            backgroundColor: '#111827',
            color: 'white',
            borderRadius: '12px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Event
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#6b7280' }}>
            Logged in as {authUser?.name || 'User'}
          </span>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              borderRadius: '12px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 