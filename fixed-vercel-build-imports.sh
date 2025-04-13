#!/bin/bash

echo "Running imports fixes..."

# Create a reusable function to patch imports
fix_imports() {
  local file="$1"
  local pattern="$2"
  local replacement="$3"
  
  if [ -f "$file" ]; then
    echo "Fixing imports in $file"
    sed -i "s|$pattern|$replacement|g" "$file"
  fi
}

# Fix app.tsx
fix_imports "pages/_app.tsx" '@/components/theme-provider' '../components/theme-provider'
fix_imports "pages/_app.tsx" '@/components/ui/toaster' '../components/ui/toaster'

# Fix API routes
fix_imports "pages/api/auth/[...nextauth].ts" '@/auth' '../../../auth'
fix_imports "pages/api/register/index.ts" '@/lib/db' '../../../lib/db'
fix_imports "pages/api/register/index.ts" '@/schemas' '../../../schemas'
fix_imports "pages/api/register/index.ts" '@/data/user' '../../../data/user'

# Fix auth pages
fix_imports "pages/sign-in.tsx" '@/components/auth/sign-in-form' '../components/auth/sign-in-form'
fix_imports "pages/sign-up.tsx" '@/components/auth/sign-up-form' '../components/auth/sign-up-form'

# Fix data module
fix_imports "data/user.ts" '@/lib/db' '../lib/db'

# Import order matters for correct build
echo "Creating build order file"
echo "
import '../lib/db';
import '../data/user';
import '../schemas';
import '../auth';
" > build-order.js

echo "Import fixes completed"