# AgriSmart - Comprehensive Agricultural Management Platform

A modern agricultural management system built with Next.js 16, MongoDB, and React 19, featuring AI-powered disease detection and multilingual support (English, Hindi, Marathi).

## Features

### Core Features
- **User Dashboard**: Personalized farming dashboard with crop management and weather alerts
- **AI Disease Detection**: Real-time crop disease identification using Teachable Machine ML models for Potato, Tomato, Onion, Corn, and Wheat with treatment recommendations
- **Market Prices**: Real-time agricultural commodity pricing with trend analysis
- **Crop Management**: Complete crop cycle tracking from planting to harvest
- **Field Management**: Track multiple fields with resource allocation and yield monitoring
- **Weather Integration**: Location-based weather forecasts using Open-Meteo API
- **Agricultural Encyclopedia**: Comprehensive crop information with images and growing guides
- **Government Schemes**: Browse and apply for agricultural schemes and subsidies
- **Soil Health Monitoring**: Advanced soil analysis with improvement recommendations
- **Crop Recommendations**: AI-powered suggestions based on soil type, climate, and season

### Technical Features
- **Multilingual Support**: Dynamic translation system powered by Tolgee (English, Hindi, Marathi)
- **Admin Dashboard**: Manage crops, schemes, farmers, and monitor system statistics
- **Type-Safe Codebase**: Comprehensive TypeScript types for MongoDB operations and API responses
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Real-time Updates**: Instant data refresh with toast notifications

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5
- **Backend**: Next.js API Routes, MongoDB 7.0
- **Database**: MongoDB Atlas
- **AI/ML**: TensorFlow.js, Teachable Machine Image Recognition
- **Styling**: Tailwind CSS 3.4, shadcn/ui
- **Authentication**: JWT-based custom auth with secure session management
- **Internationalization**: Tolgee with server-side translation proxy
- **State Management**: React Query (@tanstack/react-query)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB instance)
- Tolgee account for translations (optional)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Zeus-6874/v0-mvluhack-16-agri-smartmain2main.git
cd v0-mvluhack-16-agri-smartmain2main
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
JWT_SECRET=your_secure_random_secret_key_min_32_chars

# Admin Credentials
ADMIN_EMAIL=admin@agrismart.com
ADMIN_PASSWORD=your_admin_password

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Tolgee (Optional - for dynamic translations)
TOLGEE_API_KEY=your_tolgee_api_key
TOLGEE_API_URL=https://app.tolgee.io

# Weather API (Open-Meteo - no key required)
OPENWEATHER_API_KEY=not_required

# Vercel Integrations (if using)
KV_URL=your_upstash_redis_url
KV_REST_API_TOKEN=your_upstash_token
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
\`\`\`

### 4. Initialize MongoDB Collections
\`\`\`bash
npm run init-db
\`\`\`

This will create all necessary collections and indexes in your MongoDB database.

### 5. Run development server
\`\`\`bash
npm run dev
\`\`\`

### 6. Open in browser
Navigate to `http://localhost:3000`

## Default Admin Login

- **Email**: admin@agrismart.com
- **Password**: Admin@123456 (⚠️ Change this in production!)

Access admin dashboard at `/admin/login`

## Project Structure

\`\`\`
agrismart/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── disease/      # AI disease detection
│   │   ├── fields/       # Field management
│   │   ├── crops/        # Crop operations
│   │   └── admin/        # Admin-only routes
│   ├── admin/            # Admin pages
│   ├── dashboard/        # User dashboard
│   ├── disease-detection/ # Disease detection page
│   ├── market-prices/    # Market prices page
│   ├── schemes/          # Government schemes
│   └── [features]/       # Other feature pages
├── components/           # React components
│   ├── ui/              # UI components (shadcn)
│   ├── field/           # Field management components
│   ├── soil/            # Soil health components
│   └── admin/           # Admin components
├── lib/                  # Utility libraries
│   ├── auth/            # Authentication utilities
│   ├── mongodb/         # Database client & collections
│   ├── tolgee.tsx       # Tolgee configuration
│   ├── teachable-machine-models.ts # AI model configurations
│   └── location-data.ts # Maharashtra location data
├── types/               # TypeScript type definitions
│   ├── mongo.ts         # MongoDB document types
│   ├── api-responses.ts # API response types
│   ├── components.ts    # Component prop types
│   └── mongodb-filters.ts # MongoDB filter types
├── public/              # Static assets
└── scripts/             # Database initialization scripts
\`\`\`

## Key Features

### AI Disease Detection
Upload photos of crop leaves to detect diseases using trained Teachable Machine models:
- **Potato**: Early/Late Blight, Leaf Roll, Mosaic Virus, Bacterial Soft Rot
- **Tomato**: Early/Late Blight, Leaf Curl, Fusarium Wilt, Bacterial Spot
- **Onion**: Purple Blotch, Downy Mildew, Botrytis Leaf Blight, Thrips Damage
- **Corn**: Northern Leaf Blight, Gray Leaf Spot, Southern Rust, Common Rust
- **Wheat**: Leaf Rust, Stem Rust, Powdery Mildew, Septoria Leaf Blotch

Each detection provides symptoms, organic/chemical treatments, and prevention tips.

### Multilingual Support
Dynamic translation system powered by Tolgee with server-side proxy:
- Switch between English, Hindi, and Marathi from any page
- Translations fetch from Tolgee API in real-time
- Fallback to English if translation unavailable
- Language preference persists across sessions

### Location-Based Services
Profile setup includes cascading dropdowns for State → District → Village selection with complete Maharashtra data covering all 36 districts and 300+ villages.

### Weather Forecasting
Powered by Open-Meteo API (no API key required), providing:
- 5-day weather forecasts
- Temperature, humidity, wind speed
- Location-based accurate predictions
- Weather alerts and notifications

### Type-Safe Codebase
Comprehensive TypeScript implementation:
- MongoDB document types for all 14 collections
- API response interfaces
- Component prop types
- MongoDB filter types
- Zero `any` types in production code

## Development

### Available Scripts

\`\`\`bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
\`\`\`

### Adding New Features

1. **Database Collections**: Add types to `types/mongo.ts`
2. **API Routes**: Create in `app/api/[feature]/route.ts`
3. **Components**: Add to appropriate folder in `components/`
4. **Types**: Define in `types/` directory
5. **Translations**: Add keys to Tolgee platform

### Type Safety Guidelines

- Always use TypeScript types from `types/` directory
- Use MongoDB generic types: `findOne<MongoUser>()`
- Never use `any` - create proper interfaces
- Export types for reusability

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Connect MongoDB Atlas
5. Deploy

The app is optimized for Vercel with:
- Next.js 16 App Router
- Edge-compatible API routes
- Automatic image optimization
- Zero-config deployment

### Environment Variables Setup
In Vercel dashboard, add all variables from `.env.local`:
- MongoDB connection string
- JWT secret (generate new for production)
- Admin credentials
- Tolgee API credentials
- Other integration tokens

### Database Setup
1. Create MongoDB Atlas cluster
2. Create database user with read/write permissions
3. Whitelist Vercel IP addresses (or allow all)
4. Run initialization script via API route or manual import

## Performance Optimizations

- **Build Time**: SWC minification, package imports optimization
- **Runtime**: React 19 with improved rendering, lazy loading
- **Bundle Size**: Tree-shaking, dynamic imports for heavy components
- **Images**: AVIF and WebP formats with Next.js Image optimization
- **API**: MongoDB connection pooling, query optimization
- **Caching**: Browser caching, API response caching

## Security Features

- JWT-based authentication with secure httpOnly cookies
- Password hashing with bcrypt (work factor 12)
- Admin-only routes with middleware protection
- Input validation with Zod schemas
- MongoDB injection prevention
- CSRF protection
- Secure environment variable handling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style and conventions
- Add TypeScript types for all new code
- Write meaningful commit messages
- Test on multiple devices/browsers
- Update documentation as needed

## Troubleshooting

### Common Issues

**Build Errors**:
- Ensure all environment variables are set
- Check TypeScript errors: `npm run build`
- Clear `.next` folder and rebuild

**Database Connection**:
- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas
- Ensure IP whitelist includes your deployment

**Translation Issues**:
- Verify Tolgee API credentials
- Check network requests in browser DevTools
- Fallback to English if Tolgee unavailable

## Documentation

- [Admin Access Guide](./ADMIN_ACCESS_GUIDE.md)
- [Tolgee Setup](./TOLGEE_SETUP.md)
- [TypeScript Audit Report](./TYPESCRIPT_AUDIT_REPORT.md)
- [Migration Complete](./MIGRATION_COMPLETE.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support:
- Open an issue on GitHub
- Email: support@agrismart.com
- Check documentation files in the repository

## Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Deployment platform and integrations
- **shadcn** - Beautiful UI component library
- **MongoDB** - Reliable database solution
- **TensorFlow.js & Teachable Machine** - AI/ML capabilities
- **Tolgee** - Internationalization platform
- **Open-Meteo** - Free weather API
- **All Contributors** - Thank you for making this project better

## Roadmap

- [ ] Mobile app (React Native)
- [ ] More crop disease models
- [ ] Satellite imagery integration
- [ ] IoT sensor integration
- [ ] Marketplace for buying/selling produce
- [ ] Community forum
- [ ] Video tutorials
- [ ] Advanced analytics dashboard

---

Built with ❤️ for farmers worldwide
