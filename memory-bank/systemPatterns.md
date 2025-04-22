# System Patterns: Next.js Calendar App

## Architecture Overview
The calendar app follows a component-based architecture using Next.js Pages Router. Each view (month, week, day) is implemented as a separate page component with shared utilities and components.

## View Patterns

### Common View Structure
```typescript
export default function CalendarView() {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Authentication check
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  // Data loading
  useEffect(() => {
    loadEvents();
  }, [currentDate]);
  
  return (
    <div>
      <Header />
      <Navigation />
      <ViewContent />
      <EventModal />
    </div>
  );
}
```

### View Navigation
- Each view (month/week/day) has its own route
- Navigation preserves date context through URL parameters
- Consistent header with view switcher across all views
- Previous/Next navigation buttons for date changes

### Event Display Patterns
1. Month View:
   - Grid layout with day cells
   - Events shown as colored cards
   - Overflow handling with "+X more" indicator

2. Week View:
   - Hourly grid with day columns
   - All-day events at the top
   - Time-based events positioned by start/end time
   - Event overlap handling

3. Day View:
   - Detailed hourly grid
   - Full event details visible
   - Precise time positioning
   - Event stacking for overlaps

## Component Patterns

### Event Components
```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  isAllDay: boolean;
  color?: string;
}

// Event positioning calculation
const getEventPosition = (event: Event) => {
  const startHour = new Date(event.startDate).getHours();
  const endHour = new Date(event.endDate).getHours();
  return {
    top: (startHour - START_HOUR) * HOUR_HEIGHT,
    height: (endHour - startHour) * HOUR_HEIGHT
  };
};
```

### Interactive Elements
- Hover effects on all event cards
- Scale transform on hover
- Z-index management for overlapping events
- Smooth transitions for all interactions

### Styling Patterns
- Inline styles for consistent appearance
- Semantic color coding based on event type
- Responsive grid layouts
- Consistent spacing and typography

## Data Management

### Event State Management
- Events loaded based on current view
- Filtered by date range
- Cached for performance
- Updated through modal interactions

### Date Handling
```typescript
// Date navigation
const nextDate = () => {
  const newDate = addPeriod(currentDate, 1);
  router.push(`/calendar/${view}?date=${format(newDate, 'yyyy-MM-dd')}`);
};

const prevDate = () => {
  const newDate = subPeriod(currentDate, 1);
  router.push(`/calendar/${view}?date=${format(newDate, 'yyyy-MM-dd')}`);
};
```

## Authentication Pattern
```typescript
// Client-side auth check
useEffect(() => {
  const checkAuth = () => {
    const storedAuth = sessionStorage.getItem('calendarAuth');
    if (storedAuth) {
      const auth = JSON.parse(storedAuth);
      if (auth.isAuthenticated) {
        setAuthUser(auth.user);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  };
  checkAuth();
}, []);
```

## Error Handling
- Graceful fallbacks for loading states
- Error boundaries for component failures
- Type checking for all data operations

## Performance Patterns
- Event memoization for large datasets
- Optimized rendering for time-based views
- Lazy loading for modal components
- Efficient date calculations

## Responsive Design
- Grid-based layouts that adapt to screen size
- Flexible event card sizing
- Mobile-first approach
- Touch-friendly interactions

## Future Patterns (Planned)
- Drag-and-drop event management
- Event recurrence handling
- Calendar sharing
- Real-time updates
- Advanced search functionality

## Component Structure
- **Page Components**: Main views defined in `/pages` directory (day, week, month views)
- **UI Components**: Reusable UI elements in `/components` directory
- **Calendar Grid Components**: Day cells, event display components
- **Modal Components**: Event details and creation interfaces
- **Navigation Components**: View switching and date navigation

## Key Design Patterns
- **Context API Pattern**: Used for auth state and themes
- **Responsive Design Pattern**: UI adapts to different screen sizes
- **Static Generation Pattern**: Pages pre-rendered at build time
- **Client-Side Rendering Pattern**: Dynamic updates handled on client
- **Event Color Coding Pattern**: Visual representation based on event type/title
- **Grid Layout Pattern**: For calendar display

## Visual Styling Patterns
- **Inline Styles**: All styling uses inline style objects rather than class-based systems
- **Color Theming**: Consistent color scheme across components
- **Semantic Colors**: Event colors represent the event type or category
- **Icon Integration**: SVG icons used for improved visual communication
- **Fixed Height Cells**: Calendar cells with fixed dimensions for consistent layout

## Authentication Flow
- **Demo Mode**: Uses client-side storage for auth simulation
- **Database Mode**: Connects to PostgreSQL via Prisma and NextAuth.js
- **Type Safety**: Needs improvement for authUser properties

## Data Flow
- **Event Creation**: Client-side state management for events
- **Calendar View Switching**: State-based view rendering
- **Date Navigation**: Date manipulation using date-fns library
- **Event Filtering**: Events filtered by date for each calendar view
- **Event Styling**: Dynamic styling based on event properties

## Key Technical Decisions
- Using Next.js static export for easier deployment
- Implementing modern UI components with simplified design
- Using event title/type for color coding for better visual organization
- Adopting SVG icons for improved visual appearance
- Maintaining fixed height for calendar cells for better layout
- Employing type annotations to improve code reliability

## Folder Structure
- `/pages`: Page components and routing (including calendar views)
- `/components`: Reusable UI components
- `/context`: React context providers
- `/utils`: Utility functions (including date handling)
- `/lib`: Core functionality libraries
- `/data`: Data models and schemas 