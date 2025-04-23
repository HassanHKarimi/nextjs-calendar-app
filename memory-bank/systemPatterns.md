# System Patterns

## CSS Architecture

### Tailwind CSS Structure
- Centralized component styles in `index.css` using `@layer components`
- Component-specific styles in dedicated CSS files under `styles/components/`
- Global styles and theme configuration in `styles/index.css`
- Consistent use of Tailwind utility classes across components

### Component Styling
- All component styles are imported into the main `@layer components` block
- No individual `@layer components` directives in component files
- Consistent naming conventions for component classes
- Semantic color coding for events based on their type/title

### Development Tools
- Context7 MCP for up-to-date documentation access
- MCP configuration stored locally in `.cursor/` directory
- Global installation of development tools for better accessibility

## Component Organization

### Calendar Views
- Consistent structure across day, week, and month views
- Shared navigation components for unified user experience
- Standardized event display patterns
- Reusable grid layouts and cell components

### Event Handling
- Consistent event styling across all views
- Unified hover effects and interactions
- Standardized modal components for event creation/editing
- Shared event type definitions and utilities

### Navigation
- Centralized navigation controls
- Consistent view switching mechanism
- Unified date navigation patterns
- Standardized button and control styling

## State Management

### Event State
- Centralized event management
- Consistent event creation/editing flow
- Unified event display logic
- Standardized event type handling

### View State
- Consistent view switching mechanism
- Unified date navigation
- Standardized view-specific state management
- Shared view configuration

## Error Handling

### Component Errors
- Consistent error boundary implementation
- Unified error display patterns
- Standardized error recovery mechanisms
- Shared error logging and reporting

### Data Errors
- Centralized data validation
- Consistent error messaging
- Unified error recovery flows
- Standardized error state handling

## Performance Optimization

### CSS Optimization
- Centralized style management
- Efficient Tailwind utility usage
- Consistent class naming
- Optimized style imports

### Component Optimization
- Efficient event rendering
- Optimized view switching
- Consistent performance patterns
- Standardized optimization techniques

## Development Workflow

### Tool Integration
- Context7 MCP for documentation
- Local development tools configuration
- Consistent tool usage patterns
- Standardized development practices

### Code Organization
- Clear component hierarchy
- Consistent file structure
- Unified naming conventions
- Standardized import patterns

## Testing Strategy

### Component Testing
- Consistent test patterns
- Unified test utilities
- Standardized test organization
- Shared test helpers

### Integration Testing
- Centralized test configuration
- Consistent test coverage
- Unified test reporting
- Standardized test patterns

## Deployment Strategy

### Build Process
- Optimized CSS compilation
- Consistent build configuration
- Unified deployment patterns
- Standardized build artifacts

### Environment Configuration
- Local development setup
- Consistent environment variables
- Unified configuration patterns
- Standardized deployment process

## Navigation Architecture
- Shared CalendarNavigation component for consistent UI
- View switching handled through router
- URL parameters for deep linking
- Consistent navigation patterns across all views
- Single source of truth for current view state

## Component Structure
### Shared Components
- `CalendarNavigation`: Main navigation component
- `EventModal`: Reusable event display/edit modal
- Event components for different view contexts

### View Components
- `MonthView`: Calendar grid with event display
- `WeekView`: Weekly schedule with hourly grid
- `DayView`: Daily schedule with hourly grid

### Component Patterns
- Consistent prop interfaces
- Shared styling patterns
- Common event handling
- Unified navigation approach

## Event Management
- Consistent event display across views
- Standardized event positioning
- Hover effects and interactions
- Event color coding system
- Overflow handling for multiple events

## State Management
- URL-based view state
- Local state for UI interactions
- Session storage for auth
- Consistent state updates
- Props for shared state

## Styling Patterns
- Inline styles for components
- Consistent color schemes
- Responsive design principles
- Interactive element styling
- Grid-based layouts

## Authentication Flow
- Session-based auth
- Protected routes
- Auth state management
- Login persistence
- Secure routing

## Error Handling
- Graceful fallbacks
- Loading states
- Auth error handling
- Data validation
- Type safety

## Code Organization
- Feature-based directory structure
- Shared utilities
- Type definitions
- Component reuse
- Clean imports

## Performance Patterns
- Optimized rendering
- Event caching
- Lazy loading
- State optimization
- Transition handling

## Testing Strategy
- Component testing
- Integration tests
- Auth testing
- Event handling tests
- Navigation testing

## Security Patterns
- Protected routes
- Data validation
- Safe state management
- Secure auth flow
- Input sanitization

## Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

## Mobile Support
- Responsive design
- Touch interactions
- Mobile-first approach
- Adaptive layouts
- Performance optimization

## Architecture Overview
The calendar app follows a component-based architecture using Next.js Pages Router. Each view (month, week, day) is implemented as a separate page component with shared utilities and components.

## View Patterns

### Single-Page Calendar Structure
```typescript
// Main Calendar Component Pattern
const CalendarPage = () => {
  const [currentView, setCurrentView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  return (
    <div>
      <Header />
      <TabNavigation 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <CalendarContainer>
        {currentView === 'month' && <MonthView date={currentDate} />}
        {currentView === 'week' && <WeekView date={currentDate} />}
        {currentView === 'day' && <DayView date={currentDate} />}
      </CalendarContainer>
    </div>
  );
};
```

### View Navigation
- Single page with persistent navigation tabs
- View state controls content rendering
- URL parameters for deep linking without page navigation
- Shared state and context across all views
- Smooth transitions between views

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