# Deployment Fix Documentation

## Issue Identified

The deployment was failing with the following error:
```
[17:14:32.492] Module not found: Can't resolve './components/filter-panel'
```

## Root Cause Analysis

1. The build script in the deployment process removes certain directories, including `pages/calendar/components`
2. The FilterPanel component was located in this directory, causing it to be missing during the build
3. In the pre-build.sh script, there's code that explicitly removes the calendar/components directory:
   ```bash
   # Removed pages/calendar/components directory if it existed
   ```

## Solution Implemented

1. Moved the FilterPanel component to the `pages/calendar/utils` directory, which is preserved during the build process
2. Updated the import path in all files to reference the component from its new location:
   ```typescript
   import { FilterPanel, FilterState } from "./utils/filter-panel";
   ```
3. This change ensures that the component is available during build while maintaining all functionality

## Testing

After making these changes, the build should complete successfully. The updated path structure is:

- `pages/calendar/utils/filter-panel.tsx` - New location for the filter panel component
- `pages/calendar/utils/event-modal.tsx` - Existing event modal component
- `pages/calendar/utils/seed-events.ts` - Event seed data generator

This maintains the same functionality while being compatible with the deployment process.
