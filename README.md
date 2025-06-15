# Algocipher Radar - AI-Powered Trading Signal Platform

A sophisticated Next.js application that provides real-time AI-powered trading signals with advanced pattern recognition, market analysis, and comprehensive trading tools.

## 🚀 Features

### Core Functionality
- **Real-time Signal Detection**: AI-powered pattern recognition across multiple markets (Forex, Crypto, Stocks, Indices)
- **Advanced Chart Analysis**: Interactive trading charts with technical indicators and pattern overlays
- **Signal Feed**: Live feed of trading signals with confidence scoring and risk/reward ratios
- **Trading Journal**: Comprehensive trade tracking and performance analysis
- **Alert System**: Multi-channel notifications (Email, Telegram, Webhooks)
- **Market Overview**: Real-time market data and trading session clocks

### Authentication & User Management
- **Multi-provider OAuth**: Google, GitHub, Apple sign-in
- **Secure Authentication**: JWT-based auth with session management
- **User Profiles**: Comprehensive profile management with trading preferences
- **Subscription Plans**: Free, Pro, and Premium tiers with feature gating

### Advanced Features
- **Command Palette**: Quick navigation and actions (⌘K)
- **Drag & Drop**: Sortable signal cards with DnD Kit
- **Real-time Updates**: Live signal updates and market data
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Notification Center**: Comprehensive notification system with filtering

## 🛠 Tech Stack

### Frontend
- **Next.js 13.5.1** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Component library built on Radix UI
- **Recharts** - Chart library for data visualization

### Key Libraries
- **@dnd-kit** - Drag and drop functionality
- **date-fns** - Date manipulation
- **lucide-react** - Icon library
- **next-themes** - Theme management
- **sonner** - Toast notifications
- **cmdk** - Command palette

## 📁 Project Structure

```
algocipher-radar/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── signin/               # Sign in page
│   │   ├── signup/               # Sign up page
│   │   └── callback/             # OAuth callbacks
│   ├── dashboard/                # Main dashboard
│   ├── profile/                  # User profile settings
│   ├── landing/                  # Landing page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (auth check)
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # Shadcn/ui components
│   ├── alerts/                   # Alert management
│   ├── charts/                   # Trading charts
│   ├── command-palette/          # Command palette
│   ├── dashboard/                # Dashboard components
│   ├── layout/                   # Layout components
│   ├── market/                   # Market data components
│   ├── notifications/            # Notification system
│   ├── profile/                  # Profile settings
│   ├── signals/                  # Signal components
│   └── trading/                  # Trading tools
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
│   ├── auth-config.ts            # OAuth configuration
│   ├── mock-data.ts              # Mock data generators
│   ├── signal-detector.ts        # Signal detection engine
│   ├── signal-types.ts           # Signal type definitions
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
│   ├── logo icon.svg             # Logo icon
│   ├── Dark with wordmark.svg    # Dark theme logo
│   └── Light with wordmark.svg   # Light theme logo
└── middleware.ts                 # Next.js middleware
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd algocipher-radar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure Environment Variables**
   Edit `.env.local` with your OAuth credentials:
   ```env
   # Google OAuth
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # GitHub OAuth
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   
   # Apple OAuth
   NEXT_PUBLIC_APPLE_CLIENT_ID=your-apple-client-id
   APPLE_CLIENT_SECRET=your-apple-client-secret
   
   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key
   
   # App URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Application**
   Navigate to `http://localhost:3000`

### Demo Credentials
For testing purposes, use these demo credentials:
- **Email**: `demo@algocipher.com`
- **Password**: `demo123`

## 🔧 Configuration

### OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/callback/google`

#### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/auth/callback/github`

#### Apple OAuth
1. Go to Apple Developer Console
2. Create a new Service ID
3. Configure Sign in with Apple
4. Set Return URL: `http://localhost:3000/auth/callback/apple`

### Theme Configuration
The app supports both dark and light themes with automatic system detection:
- Default theme: Dark
- Theme persistence: localStorage
- System theme detection: Enabled

## 📊 Signal Detection Engine

The application includes a sophisticated signal detection engine (`lib/signal-detector.ts`) that:

### Pattern Categories
1. **Price Action**: Breakouts, support/resistance bounces
2. **Candlestick Patterns**: Engulfing, hammer, shooting star
3. **Chart Patterns**: Head & shoulders, triangles, flags
4. **Indicator Signals**: RSI, MACD, moving average crosses
5. **Support/Resistance**: Fibonacci levels, psychological levels

### Technical Indicators
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- SMA (Simple Moving Average)
- EMA (Exponential Moving Average)
- VWAP (Volume Weighted Average Price)
- ATR (Average True Range)

### Signal Scoring
- Confidence levels: 60-95%
- Risk/reward ratios: 1.5:1 to 3.2:1
- Historical win rates: 61-89%
- Volume confirmation

## 🎨 Design System

### Color Palette
- **Primary**: Green (#22c55e) - Trading success, bullish signals
- **Secondary**: Blue (#3b82f6) - Neutral signals, information
- **Accent**: Yellow (#eab308) - Warnings, high confidence
- **Success**: Green variants
- **Warning**: Orange/Yellow variants
- **Error**: Red variants

### Typography
- **Font**: Inter (system fallback)
- **Sizes**: Micro (10px), Tiny (11px), Small (12px), Base (13px)
- **Weights**: Normal (400), Medium (500), Semibold (600), Bold (700)

### Components
All components follow the Shadcn/ui design system with custom trading-specific styling.

## 🔐 Security Features

### Authentication
- JWT token-based authentication
- OAuth 2.0 integration
- Session management
- CSRF protection via Next.js middleware

### Data Protection
- Input validation and sanitization
- XSS protection
- Secure cookie handling
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Static Export (Current Configuration)
The app is configured for static export:
```bash
npm run build
# Outputs to 'out' directory
```

### Environment Variables for Production
Ensure all environment variables are properly set in your deployment platform.

## 🧪 Testing

### Demo Features
- Mock signal generation
- Simulated real-time updates
- Demo trading data
- Test notification system

### Development Tools
- TypeScript for type safety
- ESLint for code quality
- Next.js development tools
- React Developer Tools support

## 📈 Performance Optimizations

### Code Splitting
- Automatic code splitting via Next.js
- Dynamic imports for heavy components
- Lazy loading of non-critical features

### Image Optimization
- Next.js Image component (disabled for static export)
- SVG icons for scalability
- Optimized asset loading

### Bundle Optimization
- Tree shaking enabled
- Minimal bundle size
- Efficient re-renders with React optimization

## 🔧 Customization

### Adding New Signal Patterns
1. Define pattern in `lib/signal-types.ts`
2. Implement detection logic in `lib/signal-detector.ts`
3. Add pattern icon to `components/signals/enhanced-signal-card.tsx`

### Extending Notification Channels
1. Add channel type to notification types
2. Implement channel logic in notification provider
3. Add UI controls in notification settings

### Theme Customization
1. Modify CSS variables in `app/globals.css`
2. Update Tailwind config in `tailwind.config.ts`
3. Adjust component styling as needed

## 🐛 Known Issues & Fixes

### Recent Fixes
- **AlertDialog Accessibility**: Fixed missing DialogTitle for screen readers
- **Notification Z-index**: Fixed dropdown positioning behind dashboard content
- **Dashboard Height**: Aligned dashboard height with sidebar

### Common Issues
1. **OAuth Redirect Issues**: Ensure redirect URIs match exactly in OAuth provider settings
2. **Theme Flashing**: Normal behavior on first load, resolves after hydration
3. **Signal Updates**: Mock data updates every 8 seconds for demonstration

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)

### Trading Resources
- [TradingView](https://www.tradingview.com/) - Chart analysis
- [Investopedia](https://www.investopedia.com/) - Trading education

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Consistent component structure
- Comprehensive error handling

## 📄 License

This project is proprietary software. All rights reserved.

---

**Note**: This is a demonstration application with mock data. For production use, integrate with real trading APIs and implement proper data persistence.