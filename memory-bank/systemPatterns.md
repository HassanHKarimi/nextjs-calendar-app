# System Patterns: Next.js Calendar App

## Architecture Overview

### Client-Side Navigation
- Uses Next.js router for client-side navigation
- Implements shallow routing for view changes
- Maintains URL synchronization with view state
- Handles view transitions without full page reloads

### State Management
- Uses React useState for local state management
- Implements URL-based state synchronization
- Maintains view state in sync with URL parameters
- Handles loading states for smooth transitions

### Component Structure
- Main calendar container in pages/calendar/index.tsx
- Modular view components (month, week, day)
- Shared event modal component
- Reusable UI components for navigation and controls

### Event Handling
- Client-side event filtering and display
- Semantic color coding based on event type
- Interactive event display with hover effects
- Modal-based event details view

### Styling Patterns
- Inline styles for component-specific styling
- Consistent color schemes for event types
- Responsive layout using CSS Grid
- Interactive transitions and animations

### Authentication Flow
- Session-based authentication
- Client-side auth state management
- Protected route handling
- Demo mode support

### Data Management
- Client-side event data handling
- Date manipulation using date-fns
- Event filtering and sorting
- Cache management for performance

### Navigation Patterns
- View-based navigation (month/week/day)
- Date-based navigation (prev/next)
- URL parameter synchronization
- Shallow routing for view changes

### Error Handling
- Client-side error boundaries
- Loading state management
- Authentication error handling
- Data validation checks

### Performance Patterns
- Optimized event rendering
- Lazy loading of views
- Transition animations
- Efficient state updates

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