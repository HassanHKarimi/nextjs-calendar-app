import React from "react";

// Define event modal component to display event details
export const EventModal = ({ event, onClose }) => {
  if (!event) return null;

  // Determine event color class based on title
  const getEventColorClass = (title) => {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('meeting')) return '#93c5fd'; // blue
    if (lowerTitle.includes('lunch') || lowerTitle.includes('break')) return '#86efac'; // green
    if (lowerTitle.includes('deadline') || lowerTitle.includes('due')) return '#fca5a5'; // red
    if (lowerTitle.includes('review')) return '#fde68a'; // yellow
    if (lowerTitle.includes('planning')) return '#d8b4fe'; // purple
    if (lowerTitle.includes('training') || lowerTitle.includes('workshop')) return '#f9a8d4'; // pink
    if (lowerTitle.includes('call') || lowerTitle.includes('appointment')) return '#fdba74'; // orange
    return '#d1d5db'; // gray (default)
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return 'All day';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const eventColor = getEventColorClass(event.title || '');
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#333'
          }}>{event.title}</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{
          borderLeft: `4px solid ${eventColor}`,
          paddingLeft: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: 500, color: '#555' }}>Date: </span>
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <span style={{ fontWeight: 500, color: '#555' }}>Time: </span>
            <span>{event.allDay ? 'All day' : `${formatTime(event.time)} - ${formatTime(event.endTime || '')}`}</span>
          </div>
          
          {event.location && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 500, color: '#555' }}>Location: </span>
              <span>{event.location}</span>
            </div>
          )}
        </div>
        
        {event.description && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 500,
              marginBottom: '8px',
              color: '#444'
            }}>Description</h3>
            <p style={{
              margin: 0,
              color: '#555',
              lineHeight: '1.5'
            }}>{event.description}</p>
          </div>
        )}
        
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '16px'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#f3f4f6',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              color: '#444',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EventModalComponent() {
  return null; // This is just a placeholder for direct imports
}
