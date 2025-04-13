# Next.js Calendar App

A simple calendar application built with Next.js, TypeScript, and Tailwind CSS. The application includes day, week, and month views for calendar events.

## Features

- **Multiple Calendar Views**: Day, Week, and Month views
- **Demo Authentication**: Simulated login without requiring a database
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Event Display**: View event details by clicking on events
- **Modern UI**: Built with Tailwind CSS
- **Database Ready**: Optional connection to PostgreSQL via Neon

## Tech Stack

- Next.js 15 (with support for both App Router and Pages Router)
- TypeScript
- Tailwind CSS
- NextAuth.js for authentication structure
- Prisma ORM (optional for database connection)
- Demo mode for authentication without a database

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
- Calendar events are created on the client side

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

After the first deployment, you can set up:
- Custom domain (if desired)
- Automatic deployments from the GitHub repository
- Preview deployments for pull requests

### Router Implementation

This project is built with a dual routing system:
- **Pages Router**: Used in production deployment and demo mode
- **App Router**: Included as a potential future version

The pre-build and post-build scripts handle conflict resolution during deployment.

## Environment Variables

The following environment variables can be set:

- `NEXT_PUBLIC_DEMO_MODE`: Set to "true" to enable demo authentication mode
- `NEXTAUTH_URL`: The URL of your application
- `NEXTAUTH_SECRET`: Secret used by NextAuth for encryption
- `DATABASE_URL`: Only needed if not using demo mode

## Troubleshooting Deployment

### Common Deployment Issues

1. **"Found pages without a React Component as default export"**
   - This happens when non-page files are present in the `pages` directory
   - In this project, we've moved auth-context.js to the `/context` directory to fix this
   - We've also added a proper React component in `pages/auth/index.tsx` that redirects to sign-in

2. **Router Conflict Errors**
   - This project contains both App Router and Pages Router implementations
   - The vercel-build.sh script focuses on the Pages Router for deployment

3. **Authentication Errors**
   - Ensure `NEXTAUTH_SECRET` is properly set in your environment variables
   - For demo mode, verify that `NEXT_PUBLIC_DEMO_MODE` is set to "true"
   - Check browser console for more specific error messages

4. **"Module not found" Errors**
   - This can happen if dependencies weren't installed correctly
   - Try deploying with the "Force New Build" option on Vercel
   - If using the CLI, run `vercel --prod --force`

5. **"Routes Manifest Could Not Be Found" Error**
   - This can happen when the Next.js build output directory doesn't match Vercel's expected location
   - We've fixed this by setting `distDir: 'dist'` in next.config.js and explicitly creating the routes-manifest.json file

### Deployment Infrastructure

The project now uses a streamlined deployment approach:

- `vercel.json` - Configures Vercel-specific settings like:
  - Build command: `bash ./vercel-build.sh`
  - Output directory: `dist`
  - Environment variables

- `vercel-build.sh` - The main build script that:
  - Creates the Next.js configuration
  - Generates necessary files for NextAuth
  - Creates directory structure
  - Sets up auth-related components
  - Ensures the routes-manifest.json is available

This approach ensures consistent, reliable deployments by creating all necessary files during the build process, rather than relying on pre-existing files that might be missing or have issues.
