# Alpha Kite - Trading Dashboard

A real-time trading dashboard for QQQ options using Schwab API, deployed with Vercel (frontend) and Railway (backend).

## Features

- **Real-time EST Time Display**: Shows current time in Eastern Standard Time
- **Market Hours Indicator**: Visual indicator for market open/closed status (9 AM - 4 PM EST, weekdays)
- **Data Counters**: Live counters for equity and options data points
- **Real-time Updates**: WebSocket connection for live data streaming
- **Responsive Design**: Modern React UI with Tailwind CSS

## Architecture

- **Frontend**: Next.js 14 with React 18, deployed on Vercel
- **Backend**: Node.js/Express with Socket.IO, deployed on Railway
- **Real-time Communication**: WebSocket for live data updates
- **Styling**: Tailwind CSS for responsive design

## Deployment Status

✅ **Phase 1 Complete**: Basic React GUI with EST time and market hours deployed to Vercel/Railway

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alpha-kite
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install

   # Backend
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   npm run dev
   ```

5. **Open browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Deployment

### Frontend (Vercel)

1. **Connect to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set environment variables in Vercel dashboard**
   - Add production environment variables

### Backend (Railway)

1. **Deploy to Railway**
   ```bash
   railway login
   railway link
   railway up
   ```

2. **Set environment variables in Railway dashboard**
   - Add production environment variables

## Project Structure

```
alpha-kite/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── backend/               # Node.js backend
│   ├── src/
│   │   └── index.ts       # Main server file
│   ├── package.json
│   ├── railway.toml       # Railway deployment config
│   └── tsconfig.json
├── .env.example          # Environment variables template
├── next.config.js        # Next.js configuration
├── package.json          # Frontend dependencies
├── tailwind.config.ts    # Tailwind CSS configuration
└── vercel.json           # Vercel deployment config
```

## Next Steps

- [ ] Phase 2: Data downloaders for equity and options data
- [ ] Phase 3: Data normalization (ETL 1)
- [ ] Phase 4: Real-time charting with WebSocket updates
- [ ] Phase 5: Schwab API integration for live data
- [ ] Phase 6: VWAP/MA9 calculation and signal generation
- [ ] Phase 7: Trade execution and position management
- [ ] Phase 8: Daily P/L reporting

## Configuration

### Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL for frontend
- `NODE_ENV`: Environment (development/production)
- `PORT`: Backend server port
- `SCHWAB_API_KEY`: Schwab API key (when implemented)
- `SCHWAB_API_SECRET`: Schwab API secret (when implemented)

### Trading Parameters

- **Trading Capital**: $5,000,000
- **Contracts per Trade**: 25
- **MA9 Period**: 9 minutes
- **Signal Cooldown**: 30 seconds

## Market Hours

- **Regular Hours**: 9:00 AM - 4:00 PM EST (Monday-Friday)
- **30-minute Buffer**: Trading system starts 30 minutes before open and ends 30 minutes after close
- **Holidays**: System respects NYSE trading holidays

## Strategy

VWAP/MA9 crossover strategy for 0DTE QQQ options:

1. Monitor QQQ equity data for VWAP vs MA9 inversions
2. Generate short signals on crossovers
3. Exit on market close, stop-loss (200%), take-profit (50%), or reverse crossover
4. Single position rule (one open option position at a time)

## License

Private project for educational and research purposes.
