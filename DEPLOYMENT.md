# Calendar App Deployment Guide

## Critical Configuration

This Next.js calendar application uses a **static export deployment approach**. The following configuration settings are critical and should not be changed without extensive testing:

### 1. Static Export Mode

The `output: 'export'` setting in next.config.js is **REQUIRED**. This setting causes Next.js to generate static HTML files instead of using server-side rendering, which is essential for successful deployment on Vercel.

```javascript
// next.config.js
const nextConfig = {
  // ...other settings
  output: 'export',
  images: { unoptimized: true },
  // ...other settings
};
```

### 2. Distribution Directory

The build output directory is set to `dist` in both next.config.js and vercel.json. These must match:

```javascript
// next.config.js
distDir: 'dist',
```

```json
// vercel.json
"outputDirectory": "dist",
```

### 3. Build Script

The build process is managed by `vercel-build.sh`, which:
- Creates the Next.js configuration with static export mode
- Installs required dependencies
- Generates Next.js build artifacts
- Creates fallback static HTML if needed

This script is referenced in vercel.json and should be used for all deployments:

```json
"buildCommand": "bash ./vercel-build.sh",
```

## Routing & Navigation

### Static HTML Approach

This application uses pre-rendered static HTML files for all routes. Key differences from typical Next.js apps:

1. **No server-side rendering**: All pages are pre-rendered to HTML during build
2. **No API routes**: API routes won't work in static export mode 
3. **Client-side navigation**: All navigation is handled client-side
4. **No rewrites/redirects**: Vercel's rewrite/redirect features aren't used

### Authentication

Authentication is handled entirely client-side using `sessionStorage`. This approach is used because:

1. Server-side authentication won't work in static export mode
2. The application doesn't connect to a real database in demo mode
3. It simplifies deployment without sacrificing the user experience

## Styling Approach

### Inline Styles

Tailwind CSS has been removed in favor of inline styles to:
1. Simplify the build process
2. Reduce external dependencies
3. Ensure consistent styling across deployments

When adding new components, use React's inline style objects:

```jsx
<div style={{ 
  marginTop: '1rem', 
  color: '#333',
  display: 'flex',
  justifyContent: 'center'
}}>
  Content here
</div>
```

### Global Styles

A minimal global stylesheet is maintained in `src/app/styles.css` with:
- Basic typography
- Animation keyframes
- Simple color utilities
- Layout helpers

Add new global styles here only when absolutely necessary.

## Deployment Troubleshooting

### Common 404 Errors

If you encounter 404 errors after deployment:

1. **Check static export mode**: Verify `output: 'export'` is in next.config.js
2. **Examine build logs**: Look for errors in the Next.js build process
3. **Check dist directory**: Ensure HTML files are being generated for all routes
4. **Test locally**: Run `npm run test-vercel-build` and check output

### Build Process Issues

The build process must generate proper static HTML files:

1. **Dependencies**: Ensure all dependencies are installed correctly
2. **Build script**: Verify vercel-build.sh executed successfully
3. **Output directory**: Check that files are correctly output to the `dist` directory

### Manual Fallback

If routing consistently fails:
1. Edit vercel-build.sh to enable the fallback HTML generation
2. The fallback will automatically be used when routing fails

## Local Development vs Deployment

### Key Differences

Local development and production deployment have important differences:

1. **Development server**: The dev server uses server-side rendering
2. **Static production**: The deployed site uses pre-rendered HTML
3. **API endpoints**: API routes work in development but not in production
4. **File routing**: File-based routing behaves differently in production

### Testing Production Builds

To test a production-like build locally:

```bash
# Run the Vercel build script
npm run test-vercel-build

# Serve the static output
npx serve ./dist

# Visit http://localhost:3000 to test
```

This simulates the Vercel deployment environment and helps identify issues before deploying.

## Future Improvements

### Potential Enhancements

For future development, consider:

1. **Hybrid approach**: Implement a hybrid SSG/SSR approach for more dynamic content
2. **API integration**: Add serverless functions for API endpoints if needed
3. **Build optimization**: Improve the build script for faster deployments
4. **Progressive enhancement**: Add offline support and PWA features

Always test thoroughly when making architectural changes to the deployment approach.