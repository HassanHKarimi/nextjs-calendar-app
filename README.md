# Next.js Calendar App

> **⚠️ IMPORTANT: STATIC EXPORT MODE**  
> This application uses Next.js static export mode instead of server-side rendering.
> Do not modify the `output: 'export'` setting in next.config.js without careful testing!

A simple calendar application built with Next.js, TypeScript, and inline styles (previously used Tailwind CSS). The application includes day, week, and month views for calendar events.

## Features

- **Multiple Calendar Views**: Day, Week, and Month views
- **Demo Authentication**: Simulated login without requiring a database
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Event Display**: View event details by clicking on events
- **Modern UI**: Built with Tailwind CSS
- **Database Ready**: Optional connection to PostgreSQL via Neon

## Tech Stack

- Next.js 15 (Pages Router with static export mode)
- TypeScript
- Inline CSS styles (Tailwind CSS was removed to simplify deployment)
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

### Deployment Architecture

This project uses a static site generation approach:
- **Static Export Mode**: Pages are pre-rendered to static HTML during build
- **No Server-Side Rendering**: All functionality runs client-side
- **Pages Router Only**: The App Router implementation has been removed

The build scripts generate all necessary static files and HTML during deployment.

## Environment Variables

The following environment variables can be set:

- `NEXT_PUBLIC_DEMO_MODE`: Set to "true" to enable demo authentication mode
- `NEXTAUTH_URL`: The URL of your application
- `NEXTAUTH_SECRET`: Secret used by NextAuth for encryption
- `DATABASE_URL`: Only needed if not using demo mode

## Troubleshooting Deployment

### Common Deployment Issues

1. **404 Errors on Root Page**
   - This application MUST use static export mode (`output: 'export'` in next.config.js)
   - Without static export, routing fails on Vercel deployment
   - If you see 404 errors, check that static export mode is enabled
   - The fallback index.html will indicate if routing is failing

2. **Styling Issues**
   - This project originally used Tailwind CSS but now uses inline styles
   - This change was made to simplify deployment and avoid CSS conflicts
   - When adding new components, use inline styles instead of Tailwind classes
   - The styles.css file contains minimal global styles

3. **"Found pages without a React Component as default export"**
   - This happens when non-page files are present in the `pages` directory
   - In this project, we've moved auth-context.js to the `/context` directory to fix this
   - Each file in the pages directory must export a React component

4. **Authentication Errors**
   - Ensure `NEXTAUTH_SECRET` is properly set in your environment variables
   - For demo mode, verify that `NEXT_PUBLIC_DEMO_MODE` is set to "true"
   - Check browser console for more specific error messages

5. **"Module not found" Errors**
   - This can happen if dependencies weren't installed correctly
   - Try deploying with the "Force New Build" option on Vercel
   - If using the CLI, run `vercel --prod --force`

6. **"Routes Manifest Could Not Be Found" Error**
   - This can happen when the Next.js build output directory doesn't match Vercel's expected location
   - We've fixed this by setting `distDir: 'dist'` in next.config.js and explicitly creating the routes-manifest.json file
   - The static export mode avoids many of these routing issues

### Deployment Infrastructure

The project now uses a streamlined static export deployment approach:

- `vercel.json` - Configures Vercel-specific settings like:
  - Build command: `bash ./vercel-build.sh`
  - Output directory: `dist`
  - Environment variables

- `vercel-build.sh` - The main build script that:
  - Creates the Next.js configuration with `output: 'export'` mode
  - Generates necessary files for NextAuth
  - Creates directory structure
  - Sets up auth-related components
  - Builds static HTML files for all routes
  - Creates a fallback index.html if needed

- `next.config.js` - Critical configuration file:
  - Sets `output: 'export'` for static HTML generation
  - Sets `images: { unoptimized: true }` for static image handling
  - Contains webpack configuration for client-side rendering

### Developer Guidelines

When working on this project, follow these important guidelines:

1. **Keep Static Export Mode Enabled**
   - The `output: 'export'` setting in next.config.js is REQUIRED
   - Without it, the application will fail to deploy correctly
   - This setting causes Next.js to generate static HTML files instead of using server-side rendering

2. **Use Inline Styles**
   - Tailwind CSS has been removed to simplify deployment
   - Use React inline style objects instead of CSS classes
   - Example: `<div style={{ marginTop: '1rem', color: '#333' }}>`
   - Add global styles to src/app/styles.css when needed

3. **Keep Auth Logic Client-Side**
   - Authentication uses client-side storage in demo mode
   - All API calls will fail in static export mode
   - Keep logic in useEffect hooks and event handlers

4. **Testing Deployment Locally**
   - Run `npm run test-vercel-build` to test the build script
   - Check the generated dist directory for proper HTML files
   - Use a local static server to test the output: `npx serve dist`

5. **Adding New Pages**
   - All new pages must be added to the Pages Router (`pages/` directory)
   - Each page must export a default React component
   - Make sure to add proper inline styles
   - Test the static export build before committing

These guidelines ensure the application remains deployable and functional.
