import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface PendingEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  category?: string;
  tags: string[];
  eventType?: string;
  website?: string;
  registrationUrl?: string;
  price?: string;
  organizer?: string;
  venue?: string;
  city?: string;
  country?: string;
  capacity?: number;
  difficulty?: string;
  source: string;
  confidence: number;
  sourceUrl?: string;
  createdAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function PendingEventsPage() {
  const router = useRouter();
  
  // Mock session for demo - in production you'd use real authentication
  const session = { user: { role: 'ADMIN', email: 'admin@example.com' } };
  const status = 'authenticated' as 'loading' | 'authenticated' | 'unauthenticated';
  const [events, setEvents] = useState<PendingEvent[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    source: '',
    verified: 'false' // Only show unverified events
  });

  // Redirect if not admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/sign-in');
      return;
    }
    
    // Check if user is admin (you might need to adjust this based on your auth setup)
    const isAdmin = session.user?.role === 'ADMIN' || session.user?.email === 'admin@example.com';
    if (!isAdmin) {
      router.push('/calendar');
      return;
    }
    
    fetchEvents();
  }, [session, status, pagination.page, filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // This would call your ingestion service
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
      const authToken = process.env.NEXT_PUBLIC_SCRAPER_AUTH_TOKEN;
      
      if (!authToken) {
        console.error('NEXT_PUBLIC_SCRAPER_AUTH_TOKEN not configured');
        throw new Error('Authentication not configured');
      }
      
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        verified: filters.verified
      });
      
      if (filters.source) {
        params.append('source', filters.source);
      }

      const response = await fetch(`${apiBase}/events?${params}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events);
      setPagination(data.pagination);
      
    } catch (error) {
      console.error('Error fetching events:', error);
      // For demo purposes, show mock data
      setEvents([
        {
          id: 'mock-1',
          title: 'React Summit 2024',
          description: 'The biggest React conference',
          startDate: '2024-06-15T09:00:00Z',
          endDate: '2024-06-15T17:00:00Z',
          location: 'Amsterdam, Netherlands',
          category: 'Conference',
          tags: ['React', 'JavaScript', 'Frontend'],
          eventType: 'In-person',
          website: 'https://reactsummit.com',
          registrationUrl: 'https://reactsummit.com/register',
          price: '€599',
          organizer: 'GitNation',
          venue: 'Theater Amsterdam',
          city: 'Amsterdam',
          country: 'Netherlands',
          capacity: 1500,
          difficulty: 'Intermediate',
          source: 'eventbrite',
          confidence: 0.92,
          sourceUrl: 'https://eventbrite.com/e/react-summit',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ]);
      setPagination({ page: 1, limit: 20, total: 1, pages: 1 });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (eventId: string) => {
    const newSelected = new Set(selectedEvents);
    if (newSelected.has(eventId)) {
      newSelected.delete(eventId);
    } else {
      newSelected.add(eventId);
    }
    setSelectedEvents(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEvents.size === events.length) {
      setSelectedEvents(new Set());
    } else {
      setSelectedEvents(new Set(events.map(e => e.id)));
    }
  };

  const handleApprove = async () => {
    if (selectedEvents.size === 0) return;
    
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
      const authToken = process.env.NEXT_PUBLIC_SCRAPER_AUTH_TOKEN;
      
      if (!authToken) {
        console.error('NEXT_PUBLIC_SCRAPER_AUTH_TOKEN not configured');
        throw new Error('Authentication not configured');
      }
      
      const response = await fetch(`${apiBase}/events/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: Array.from(selectedEvents)
        })
      });

      if (response.ok) {
        alert(`Approved ${selectedEvents.size} events`);
        setSelectedEvents(new Set());
        fetchEvents();
      } else {
        alert('Failed to approve events');
      }
    } catch (error) {
      console.error('Error approving events:', error);
      alert('Error approving events');
    }
  };

  const handleReject = async () => {
    if (selectedEvents.size === 0) return;
    
    if (!confirm(`Are you sure you want to reject ${selectedEvents.size} events? This will delete them permanently.`)) {
      return;
    }
    
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';
      const authToken = process.env.NEXT_PUBLIC_SCRAPER_AUTH_TOKEN;
      
      if (!authToken) {
        console.error('NEXT_PUBLIC_SCRAPER_AUTH_TOKEN not configured');
        throw new Error('Authentication not configured');
      }
      
      const response = await fetch(`${apiBase}/events/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: Array.from(selectedEvents)
        })
      });

      if (response.ok) {
        alert(`Rejected ${selectedEvents.size} events`);
        setSelectedEvents(new Set());
        fetchEvents();
      } else {
        alert('Failed to reject events');
      }
    } catch (error) {
      console.error('Error rejecting events:', error);
      alert('Error rejecting events');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Pending Events - Admin</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pending Events</h1>
          <p className="mt-2 text-gray-600">
            Review and approve scraped tech events before they appear on the calendar
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                value={filters.source}
                onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Sources</option>
                <option value="eventbrite">Eventbrite</option>
                <option value="meetup">Meetup</option>
                <option value="blog">Blog</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.verified}
                onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.value }))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="false">Pending</option>
                <option value="true">Approved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedEvents.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-blue-800">
                {selectedEvents.size} event{selectedEvents.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  Approve Selected
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Reject Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEvents.size === events.length && events.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedEvents.has(event.id)}
                      onChange={() => handleSelectEvent(event.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {event.organizer}
                      </div>
                      {event.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          {event.category}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {new Date(event.startDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.city}, {event.country}
                    </div>
                    <div className="text-xs text-gray-400">
                      {event.eventType}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {event.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900">
                        {Math.round(event.confidence * 100)}%
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${event.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{event.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                  <span className="font-medium">{pagination.pages}</span> ({pagination.total} total events)
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.pages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 