# System Patterns: Next.js Calendar App

## Architecture Overview
The application follows a client-side architecture with static generation:
- **Next.js Pages Router**: Core routing and page structure
- **Static Export Mode**: Pre-rendered HTML with client-side interactivity
- **Client-Side State Management**: React context and useState for application state
- **Demo/Database Modes**: Dual implementation approach based on environment settings

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