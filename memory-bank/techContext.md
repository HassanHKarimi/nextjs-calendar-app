# Technical Context: Next.js Calendar App

## Technology Stack
- **Frontend Framework**: Next.js 15 (Pages Router)
- **Language**: TypeScript
- **Styling**: Inline CSS styles (previously Tailwind CSS)
- **Authentication**: NextAuth.js structure with demo mode option
- **Database ORM**: Prisma (optional, for database connection)
- **Database**: PostgreSQL via Neon (optional)
- **Date Handling**: date-fns library
- **Form Handling**: react-hook-form with zod validation
- **UI Components**: Custom components with some Radix UI primitives
- **Icons**: Inline SVG components for UI elements

## UI Implementation
- **Calendar Grid**: CSS Grid for layout with fixed-height cells
- **Event Styling**: Dynamic inline styles based on event type
- **Navigation**: Custom navigation components with SVG icons
- **Typography**: System fonts with consistent sizing
- **Color System**: Semantic colors for different event types
- **Responsive Design**: Adapts to different screen sizes

## Development Environment
- Node.js and npm for package management
- Local development server via `npm run dev`
- TypeScript for type checking
- ESLint for code linting
- Environment variables via `.env.local`

## TypeScript Implementation
- React component typing with proper state management
- Event object interfaces for calendar items
- Type safety for authentication user objects
- Date handling with TypeScript-compatible libraries

## Deployment Configuration
- **Static Export Mode**: `output: 'export'` in next.config.js
- **Build Process**: Custom scripts for Vercel deployment
- **Environment Variables**:
  - `NEXT_PUBLIC_DEMO_MODE`: Controls authentication mode
  - `NEXTAUTH_URL`: Application URL
  - `NEXTAUTH_SECRET`: Secret for NextAuth
  - `DATABASE_URL`: Optional DB connection string

## Technical Constraints
- **Static Export Requirement**: Must maintain static export mode
- **Client-Side Functionality**: No server-side rendering
- **Pages Router**: Must use Pages Router (not App Router)
- **Inline Styles**: Use inline styles instead of CSS classes
- **Type Safety**: Need to properly type user authentication objects

## External Dependencies
- **Authentication**: NextAuth.js for auth structure
- **Database**: Optional PostgreSQL via Neon
- **UI Components**: Radix UI primitives
- **Form Validation**: Zod and react-hook-form
- **Date Management**: date-fns for calendar operations

## Performance Considerations
- Static HTML generation for fast initial load
- Client-side state management to minimize re-renders
- Optimized responsive design for mobile devices
- Local storage for demo mode persistence
- Efficient event filtering for calendar views
- Limited event display in calendar cells for performance

## Security Considerations
- Client-side authentication in demo mode
- NextAuth.js for secure authentication in database mode
- Environment variables for sensitive configuration
- HTTPS for production deployments 