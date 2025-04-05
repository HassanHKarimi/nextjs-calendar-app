# Next.js Calendar App

A simple calendar application built with Next.js, TypeScript, and PostgreSQL via Neon.

## Features

- User authentication
- Create, read, update, and delete calendar events
- Pre-populated calendar events
- Responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth.js for authentication
- Prisma ORM
- PostgreSQL (Neon)
- Vercel for deployment

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and fill in the required environment variables
3. Install dependencies with `npm install`
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

The application uses Neon, a serverless PostgreSQL database. You'll need to:

1. Create a Neon account
2. Create a new project and database
3. Get your connection string and add it to your `.env.local` file

## Deployment

The app is configured for easy deployment on Vercel. Just connect your repository and set up the environment variables.
