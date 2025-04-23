# Technical Context

## Technologies Used

### Frontend Framework
- Next.js (v13)
- React (v18)
- TypeScript for type safety
- Static export mode (output: 'export' in next.config.js)

### Styling
- Tailwind CSS for responsive design and utility classes
- CSS Modules for component-specific styling
- Dedicated CSS files in styles/components/ for each major component
- Custom color scheme with pastel colors for events
- CSS custom properties for consistent theming

### Date Handling
- date-fns library for date manipulation and formatting
- Custom utility functions for calendar-specific date operations

### State Management
- React Context API for global state management
- React Hooks (useState, useEffect, useContext) for component-level state
- URL parameters for view state persistence

### Authentication
- NextAuth.js for authentication (when database mode is enabled)
- Demo mode using localStorage for quick testing without database
- Support for both authenticated and unauthenticated states

### Data Storage
- PostgreSQL database (in database mode)
- Client-side storage with localStorage (in demo mode)
- API routes for data operations (in database mode)

### Deployment
- Static export configuration for any static file hosting
- Environment variables for configuration

## Development Setup

### Required Environment Variables
- `NEXTAUTH_URL`: URL for NextAuth (required for authentication)
- `NEXTAUTH_SECRET`: Secret for NextAuth sessions
- `DATABASE_URL`: PostgreSQL connection string (when using database mode)

### Development Commands
- `npm run dev`: Start development server
- `npm run build`: Build project for production
- `npm run start`: Start production server
- `npm run export`: Generate static export

### Project Structure
- `/pages`: Next.js Pages Router components
- `/components`: Reusable React components
  - `/components/ui`: UI components like CalendarDayCell and CalendarEvent
- `/styles`: CSS files
  - `/styles/components`: Component-specific CSS files
- `/utils`: Utility functions
  - `/utils/event`: Event-related utilities
  - `/utils/date`: Date-related utilities
- `/context`: React Context definitions
- `/public`: Static assets
- `/types`: TypeScript type definitions

## Component Architecture

### Calendar Components
- `CalendarPage`: Main calendar page component
  - Handles view state and navigation
  - Contains conditional rendering for different views
  - Manages authentication state
- `MonthView`: Displays calendar in month format
  - Uses `CalendarDayCell` for each day in the month
- `WeekView`: Displays calendar in week format
  - Uses time-based grid for events
- `DayView`: Displays calendar in day format
  - Uses time-based grid for events
- `CalendarNavigation`: Common navigation component for all views
  - Handles date navigation (prev/next)
  - Displays current view period

### UI Components
- `CalendarDayCell`: Renders a single day cell in month view
  - Displays date and day-specific events
  - Handles styling based on current month and today
- `CalendarEvent`: Renders a single event
  - Supports compact and expanded modes
  - Handles event styling and color coding
  - Manages hover effects and interactions
- `EventModal`: Modal for creating and editing events
  - Form for event details
  - Validation and submission handling

## Styling Approach

### CSS Organization
- Global styles in `styles/index.css`
- Component-specific styles in dedicated files:
  - `styles/components/MonthView.css`
  - `styles/components/WeekView.css`
  - `styles/components/DayView.css`
  - `styles/components/CalendarEvent.css`
  - `styles/components/CalendarNavigation.css`

### Style Patterns
- Calendar grid uses CSS Grid for layout
- Events use flexbox for internal layout
- Consistent spacing with Tailwind's spacing scale
- Responsive design with breakpoints for different screen sizes
- Interactive elements have hover/focus states
- Events use left border accent for color coding
- Subtle shadows and scale transforms for hover effects

### Color System
- Pastel color palette for event categories
- High contrast for text to ensure readability
- Subtle background colors for different states (today, current month, other month)
- Consistent border colors for structural elements

## Technical Constraints

### Static Export Mode
- No server-side rendering available
- No API routes in production (only used in development)
- All data operations must be client-side in production
- Authentication must work without server components

### Performance Considerations
- Calendar views must handle large numbers of events efficiently
- Event rendering should be optimized to prevent layout thrashing
- Complex views (week/day) need efficient rendering strategies

### Browser Compatibility
- Support for modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile and desktop
- Touch interaction support for mobile devices

## Dependencies

### Core Dependencies
- next: ^13.0.0
- react: ^18.2.0
- react-dom: ^18.2.0
- typescript: ^5.0.0
- date-fns: ^2.29.3
- tailwindcss: ^3.2.4
- next-auth: ^4.19.2 (when using authentication)

### Development Dependencies
- eslint: ^8.33.0
- prettier: ^2.8.3
- postcss: ^8.4.21
- autoprefixer: ^10.4.13

## Development Setup
- Node.js environment
- npm/yarn package management
- VS Code recommended
- ESLint + Prettier
- Git version control

## Key Dependencies
- Next.js for routing and SSG
- React for UI components
- TypeScript for type safety
- date-fns for date operations
- ESLint for code quality

## Component Architecture
### Shared Components
- CalendarNavigation
  - View switching
  - Auth status
  - Navigation controls
- EventModal
  - Event display
  - Event editing
  - Consistent styling

### View Components
- MonthView
  - Calendar grid
  - Event display
  - Date navigation
- WeekView
  - Hourly grid
  - Event positioning
  - Week navigation
- DayView
  - Hourly grid
  - Event display
  - Day navigation

## Development Patterns
- Component-based architecture
- Shared utilities
- Type-safe development
- Consistent styling
- Clean code practices

## Build Configuration
- Static HTML export
- TypeScript compilation
- Asset optimization
- Bundle analysis
- Development mode

## Testing Requirements
- Component testing
- Integration testing
- Event handling
- Navigation flows
- Authentication

## Performance Considerations
- Event rendering optimization
- State management
- Component lazy loading
- Cache implementation
- Bundle size optimization

## Security Implementation
- Session-based auth
- Protected routes
- Data validation
- Safe state management
- Input sanitization

## Deployment Strategy
- Static file hosting
- CDN distribution
- Cache policies
- Asset optimization
- Performance monitoring

## Code Organization
```src/```
- ```components/``` - Reusable UI components
- ```pages/``` - Next.js pages and routing
- ```types/``` - TypeScript definitions
- ```utils/``` - Shared utilities
- ```styles/``` - Global styles
- ```context/``` - React context providers

## Key Technical Decisions

### Routing Strategy
- Single-page application with view state management
- URL parameters for deep linking:
  - `?view=month|week|day` - Current view
  - `?date=yyyy-MM-dd` - Selected date
- No page reloads during view transitions
- History API for URL updates

### State Management
```typescript
// View state management
interface CalendarState {
  currentView: 'month' | 'week' | 'day';
  currentDate: Date;
  events: Event[];
  selectedEvent: Event | null;
}

// URL synchronization
const syncUrlWithState = (view: string, date: Date) => {
  const params = new URLSearchParams(window.location.search);
  params.set('view', view);
  params.set('date', format(date, 'yyyy-MM-dd'));
  window.history.replaceState({}, '', `?${params.toString()}`);
};
```

- Centralized state in main calendar component
- View state controls content rendering
- URL parameters for deep linking
- Session storage for auth state
- Props for component communication

### Styling Approach
- Inline styles for component styling
- No CSS-in-JS or Tailwind
- Consistent color schemes
- Responsive design patterns

### Date Handling
- date-fns library for all date operations
- Consistent date formatting across views
- Timezone consideration in date calculations
- Date parameter format: yyyy-MM-dd

### Event Management
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
```

### Authentication
- Session-based authentication
- Client-side auth checks
- Protected routes
- Demo mode support

## Development Patterns

### Component Organization
```
pages/
  calendar/
    index.tsx      # Month view
    week/
      index.tsx    # Week view
    day/
      index.tsx    # Day view
    utils/
      event-modal.tsx
```

### Code Style
- TypeScript for type safety
- Functional components
- React hooks for state
- Consistent naming conventions

### Testing Strategy
- Component unit tests
- Integration tests for views
- Event handling tests
- Date manipulation tests

### Error Handling
- Error boundaries
- Type checking
- Validation
- Fallback UI

## Deployment

### Build Process
- Next.js static export
- Asset optimization
- Code splitting
- Cache management

### Hosting Requirements
- Static file hosting
- CDN support
- HTTPS required
- Browser caching

## Future Technical Considerations

### Planned Features
- Drag-and-drop events
- Real-time updates
- Data persistence
- Calendar sharing

### Technical Debt
- Performance optimization
- Code organization
- Test coverage
- Documentation

### Scalability
- Event caching
- View optimization
- Data management
- State handling

## Documentation

### Required Documentation
- Setup guide
- Component API
- Event handling
- Authentication flow

### Code Comments
- Function documentation
- Type definitions
- Complex logic explanation
- Edge case handling 