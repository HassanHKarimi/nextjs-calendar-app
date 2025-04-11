# Next.js Calendar App

A modern, feature-rich calendar application built with Next.js, TypeScript, and Tailwind CSS. The application includes day, week, and month views for calendar events with a sleek, modern interface.

## Features

- **Modern UI Design**: Completely refreshed interface with improved visual hierarchy and modern design principles
- **Multiple Calendar Views**: Day, Week, and Month views
- **Event Categories & Tags**: Categorize events with custom tags for better organization
- **Calendar Filter System**: Comprehensive filtering by event type, tag, participant, and more
- **Pre-populated Calendar**: Includes seed data with holidays, observances, and sample events for new users
- **Visual Event Indicators**: Color-coded events with intuitive icons for quick recognition
- **Demo Authentication**: Simulated login without requiring a database
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Event Display**: View event details by clicking on events
- **Database Ready**: Optional connection to PostgreSQL via Neon

## Tech Stack

- Next.js 15 (with support for both App Router and Pages Router)
- TypeScript
- Tailwind CSS
- NextAuth.js for authentication structure
- Prisma ORM (optional for database connection)
- Demo mode for authentication without a database

## Recent Updates (Calendar UI v1.1)

This update includes significant UI/UX improvements focusing on the high-priority items from the enhancement backlog:

1. **Complete Calendar UI Redesign**
   - Modern design principles with improved visual hierarchy
   - Enhanced readability and information density
   - Consistent styling across all views

2. **Advanced Calendar Filter System**
   - Filter events by type, tag, participant, and custom criteria
   - Accessible filter panel with intuitive controls
   - Visual indicators for active filters

3. **Pre-populated Calendar Data**
   - Added seed data with common holidays and observances
   - Includes sample personal and work events for demonstration
   - Automatically generated for new users

4. **Improved Event Interaction**
   - Enhanced event display with more contextual information
   - Better visual distinction between event types
   - Improved event modal with organized information layout

## Getting Started

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and update if needed
3. Install dependencies with `npm install`
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Mode

This branch operates in "demo mode" by default, which means:
- No database connection is required
- Authentication is simulated using sessionStorage
- Calendar events are created on the client side with seed data

To use with real authentication and a database:
1. Set up a PostgreSQL database (e.g., with Neon)
2. Update the connection string in `.env.local`
3. Set `NEXT_PUBLIC_DEMO_MODE=false` in your environment

## Deployment to GitHub and Vercel

### GitHub Setup

1. Create a new repository on GitHub
2. Push your local repository to GitHub:
   ```
   git remote add origin <github-repository-url>
   git push -u origin main-vercel
   ```

### Vercel Deployment

This project contains both App Router (`src/app`) and Pages Router (`pages`) implementations. For deployment, the pre-build script automatically resolves conflicts by prioritizing the Pages Router implementation, which fully supports the demo mode.

**Option 1: Using Vercel CLI**
1. Install the Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy to Vercel: `npm run deploy`

**Option 2: GitHub Integration (Recommended)**
1. Push this repository to GitHub if you haven't already:
   ```
   git remote add origin <your-github-repo-url>
   git push -u origin main-vercel
   ```
2. Create a new project on Vercel:
   - Go to [Vercel](https://vercel.com/new)
   - Select your GitHub repository
   - Click "Import"
3. Configure the deployment settings:
   - Framework Preset: Next.js
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm i --no-audit --no-fund --legacy-peer-deps && node install-deps.js && node prisma/migrate-and-seed.js`
4. Add the following environment variables:
   - `NEXT_PUBLIC_DEMO_MODE`: `true`
   - `NEXTAUTH_SECRET`: A secure random string (generate one with `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your Vercel deployment URL (you can update this after the first deployment)
5. Click "Deploy"

## Future Enhancements

The following items are planned for future updates:

1. **Real Authentication System**: Replace demo authentication with a fully implemented NextAuth.js solution
2. **User Profiles**: Allow users to create and manage their profiles with avatars and preferences
3. **Database Integration**: Fully implement PostgreSQL with Prisma ORM for persistent data
4. **Recurring Events**: Add support for daily, weekly, monthly, and custom recurring events
5. **Event Reminders**: Implement notifications and reminders for upcoming events
6. **Drag-and-Drop Events**: Enable drag-and-drop functionality for event creation and rescheduling
7. **Time Zone Support**: Add support for different time zones with automatic conversion

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
