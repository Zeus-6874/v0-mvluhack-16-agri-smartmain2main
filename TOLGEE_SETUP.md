# Tolgee Dynamic Translation Setup

## Overview
This application uses Tolgee for dynamic, cloud-based translations that can be updated in real-time without code changes.

## Configuration

### Environment Variables Required
Add these to your Vercel project or `.env.local`:

\`\`\`bash
NEXT_PUBLIC_TOLGEE_API_URL=https://app.tolgee.io
NEXT_PUBLIC_TOLGEE_API_KEY=your_tolgee_api_key_here
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
   - Add `NEXT_PUBLIC_TOLGEE_API_URL` = `https://app.tolgee.io`
   - Add `NEXT_PUBLIC_TOLGEE_API_KEY` = your API key
   - Redeploy the application

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
2. **Collaboration** - Multiple translators can work simultaneously
3. **Context** - Translators see where text appears in the app
4. **Translation Memory** - Reuse translations across projects
5. **Machine Translation** - Auto-translate with AI assistance
6. **Version Control** - Track translation changes over time

## Development Mode

In development, you can use Tolgee DevTools to:
- Edit translations directly in the browser
- See missing translations
- Test different languages instantly

To enable DevTools, add to `lib/tolgee.tsx`:
\`\`\`typescript
import { DevTools } from "@tolgee/react"

// In Tolgee initialization:
.use(DevTools())
\`\`\`

## Notes

- API keys are safe to expose in client code as they are read-only
- Translations are cached for performance
- Fallback to English if translation is missing
- Language preference is stored in localStorage
