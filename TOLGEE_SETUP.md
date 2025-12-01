# Tolgee Dynamic Translation Setup

## Overview
This application uses Tolgee for dynamic, cloud-based translations fetched securely through a server-side API.

## Configuration

### Environment Variables Required
Add these to your Vercel project (NOT with NEXT_PUBLIC prefix for security):

\`\`\`bash
TOLGEE_API_URL=https://app.tolgee.io
TOLGEE_API_KEY=your_tolgee_api_key_here
\`\`\`

### Getting Started with Tolgee

1. **Create a Tolgee Account**
   - Go to https://app.tolgee.io
   - Sign up for a free account

2. **Create a New Project**
   - Create a project named "AgriSmart" or your preferred name
   - Add languages: English (en), Hindi (hi), Marathi (mr)

3. **Get Your API Key**
   - Go to Project Settings → API Keys
   - Create a new API key with read permissions
   - Copy the API key

4. **Add Environment Variables**
   - In Vercel: Go to Settings → Environment Variables
   - Add `TOLGEE_API_URL` = `https://app.tolgee.io` (NO NEXT_PUBLIC prefix)
   - Add `TOLGEE_API_KEY` = your API key (NO NEXT_PUBLIC prefix)
   - Redeploy the application

## Security Architecture

The application uses a **server-side proxy** to fetch translations:
- Client requests translations from `/api/translations`
- Server-side API route uses secure API key to fetch from Tolgee
- API key never exposed to client browser
- Translations cached for 1 hour for performance

## Translation Keys Structure

The application uses nested translation keys organized by feature:

### Main Categories
- `auth.*` - Authentication (login, signup)
- `profile.*` - Profile setup and management
- `nav.*` - Navigation items
- `dashboard.*` - Dashboard content
- `field.*` - Field management
- `crop.*` - Crop management
- `weather.*` - Weather forecasts
- `soil.*` - Soil health
- `disease.*` - Disease detection
- `recommendation.*` - Crop recommendations
- `market.*` - Market prices
- `schemes.*` - Government schemes
- `encyclopedia.*` - Crop encyclopedia
- `knowledge.*` - Knowledge base
- `settings.*` - Settings page
- `common.*` - Common UI elements

### Example Keys
\`\`\`
auth.login.title
auth.login.email
auth.login.password
profile.setup.title
dashboard.welcome
field.manager.add
crop.name
weather.forecast.title
\`\`\`

## Benefits of Dynamic Translations

1. **Real-time Updates** - Change translations instantly without redeployment
2. **Secure** - API keys never exposed to client
3. **Cached** - Translations cached for performance
4. **Collaboration** - Multiple translators can work simultaneously
5. **Context** - Translators see where text appears in the app
6. **Translation Memory** - Reuse translations across projects
7. **Machine Translation** - Auto-translate with AI assistance
8. **Version Control** - Track translation changes over time

## Notes

- API key is server-side only and never exposed to client
- Translations are cached for 1 hour with stale-while-revalidate
- Fallback to English if translation is missing
- Language preference is stored in localStorage
