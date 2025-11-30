# AgriSmart - Comprehensive Agricultural Management Platform

A modern agricultural management system built with Next.js 16, MongoDB, and React 19, featuring multilingual support (English, Hindi, Marathi).

## Features

- **User Dashboard**: Personalized farming dashboard with crop management and weather alerts
- **Disease Detection**: AI-powered crop disease identification with treatment recommendations
- **Market Prices**: Real-time agricultural commodity pricing with trend analysis
- **Crop Management**: Complete crop cycle tracking from planting to harvest
- **Field Management**: Track multiple fields with resource allocation and yield monitoring
- **Weather Integration**: Location-based weather forecasts using Open-Meteo API
- **Agricultural Encyclopedia**: Comprehensive crop information with images and growing guides
- **Government Schemes**: Browse and apply for agricultural schemes and subsidies
- **Soil Health Monitoring**: Advanced soil analysis with improvement recommendations
- **Multilingual Support**: Full interface translation in English, Hindi, and Marathi
- **Admin Dashboard**: Manage crops, schemes, farmers, and monitor system statistics

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Next.js API Routes, MongoDB
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: JWT-based custom auth
- **State Management**: React Query
- **Charts**: Recharts
- **Icons**: Lucide React

## Quick Start

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-repo/agrismart.git
cd agrismart
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set up environment variables
Create a `.env.local` file in the root directory:

\`\`\`env
# MongoDB
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=agrismart

# JWT for session management
JWT_SECRET=your_secure_random_secret_key

# Admin Credentials
ADMIN_EMAIL=admin@agrismart.com
ADMIN_PASSWORD=your_admin_password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Initialize MongoDB Collections
\`\`\`bash
npm run init-db
\`\`\`

### 5. Run development server
\`\`\`bash
npm run dev
\`\`\`

### 6. Open in browser
Navigate to `http://localhost:3000`

## Default Admin Login

- **Email**: admin@agrismart.com
- **Password**: Admin@123456 (change this in production!)

Access admin dashboard at `/admin/login`

## Project Structure

\`\`\`
agrismart/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin pages
│   ├── dashboard/         # User dashboard
│   └── [features]/        # Feature pages
├── components/            # React components
│   ├── ui/               # UI components (shadcn)
│   ├── field/            # Field management components
│   └── admin/            # Admin components
├── lib/                   # Utility libraries
│   ├── auth/             # Authentication utilities
│   ├── i18n/             # Internationalization
│   ├── mongodb/          # Database client & collections
│   └── location-data.ts  # Maharashtra location data
├── public/               # Static assets
└── scripts/              # Database initialization scripts
\`\`\`

## Key Features

### Multilingual Support
Switch between English, Hindi, and Marathi from any page using the language selector in the navbar.

### Location-Based Services
Profile setup includes cascading dropdowns for State → District → Village selection with complete Maharashtra data.

### Weather Forecasting
Powered by Open-Meteo API (no API key required), providing accurate 5-day forecasts based on user location.

### Real-time Updates
All CRUD operations reflect immediately with toast notifications and automatic data refresh.

### Responsive Design
Fully responsive interface optimized for mobile, tablet, and desktop devices.

## Performance Optimizations

- SWC Minification enabled
- Package imports optimization (lucide-react, radix-ui)
- Console logs removed in production
- Image optimization with AVIF and WebP formats
- React 19 with improved rendering performance

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform supporting Next.js 16:
- Netlify
- Railway
- Render
- AWS Amplify

## Development Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run init-db      # Initialize MongoDB collections
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@agrismart.com or open an issue on GitHub.

## Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- MongoDB for the reliable database
- Open-Meteo for free weather API
- All contributors who have helped build this project
