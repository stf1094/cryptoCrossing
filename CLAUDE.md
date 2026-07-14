# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (runs on localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Project Overview

This is a cryptocurrency portfolio tracking application built with Next.js 14 (App Router), React 18, Redux Toolkit, and Firebase. Users can track their crypto holdings, view market data, and read crypto news. The app supports both authenticated users and anonymous guests.

**Tech Stack:**
- Next.js 14 with App Router (all components use "use client")
- Redux Toolkit with persistence (via reduxjs-toolkit-persist)
- Firebase Authentication & Firestore
- Tailwind CSS for styling
- SWR for data fetching
- CoinGecko API for market data

## Architecture

### State Management (Redux)

The Redux store is configured in [store/index.js](store/index.js) with the following slices:

- **auth**: User authentication state (persisted)
- **portfolio**: User's coin holdings (fetched from Firestore)
- **profile**: User profile data
- **news**: Crypto news articles (fetched from Firestore)
- **market**: Market data from CoinGecko API (persisted)

**Persistence:** Only `auth` and `market` slices are persisted to localStorage.

### Firebase Architecture

**Authentication:**
- Email/password authentication via [store/actions/authAction.js](store/actions/authAction.js)
- Anonymous login supported (allows guest access)
- Firebase config in [firebaseConfig.js](firebaseConfig.js) uses environment variables

**Firestore Structure:**
```
profiles/{userId}
  - uid, email, total
  - coins (subcollection)
    - {coinId}: coinId, name, amount, currentPrice, value
```

**News:** No longer stored in Firestore. News is fetched on demand from public
RSS feeds (CoinDesk, Cointelegraph, Decrypt) via the server-side route handler
[app/api/news/route.js](app/api/news/route.js), which caches the upstream response
for 15 minutes (`revalidate = 900`), sorts by date, and buckets articles into
general / bitcoin / alts by keyword match (RSS has no category metadata).
`fetchAllNews()` in [store/actions/newsAction.js](store/actions/newsAction.js) hits
`/api/news` once and dispatches the existing three success actions. No API key or
env var required.

### Data Flow

1. **Portfolio Page**: User's holdings are fetched from Firestore via `fetchPortfolio(userId)` in [store/actions/portfolioAction.js](store/actions/portfolioAction.js)
2. **Market Data**: CoinGecko API fetches 500 coins (2 pages of 250 each) via `getMarket()` action
3. **Price Updates**: `updatePrices()` syncs CoinGecko prices with user's portfolio in Firestore
4. **Adding Coins**: If coin already exists, amounts are combined; otherwise new document is created

### Layout & Routing

- Root layout ([app/layout.js](app/layout.js)) wraps entire app with Redux Provider and PersistGate
- [components/Entry.js](components/Entry.js) conditionally renders Navbar2 only for authenticated users
- Routes: `/` (landing), `/login`, `/register`, `/portfolio`, `/market`, `/news`, `/account`

### Key Components

- **AddCoinSlideover**: Slideover panel for adding coins to portfolio
- **Results**: Displays portfolio coins as a list
- **PriceTable**: Market data table (used on market page)
- **Navbar2**: Navigation bar (only shown when authenticated)
- **Entry**: Wrapper that conditionally renders navbar based on auth state

## Important Patterns

### API Rate Limiting
CoinGecko API has rate limits. The `getMarket()` action includes a 1-second delay between page requests to avoid 429 errors.

### Client Components
All app pages and most components use `"use client"` directive since they rely on hooks, Redux, or browser APIs.

### Authentication Checks
Pages that require authentication (portfolio, market, news, account) should:
1. Check `isAuthenticated` from Redux state
2. Redirect to `/login` if not authenticated
3. Return `null` during redirect to prevent flash of content

### Portfolio Updates
When adding/updating coins:
1. Check if coin already exists in portfolio
2. If yes: update amount and recalculate value
3. If no: create new coin document
4. Always call `fetchPortfolio()` after mutations to refresh data
5. Update total portfolio value in profile document

### SWR Usage
Market data is fetched via SWR hook for automatic revalidation and caching. Check both `!data` and `!error` for loading state.

## Environment Variables

Create a `.env` file with Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Common Issues

### CoinGecko API Errors
- Page 2 requests may fail with rate limiting. Check console for error_message
- Market data fetches 250 coins per page, max 2 pages (500 total)
- API calls use precision parameter to limit decimal places

### Firestore Operations
- All Firestore operations require user to be authenticated
- Portfolio coins are stored as subcollection under user's profile
- Use `auth.currentUser.uid` to access current user's data

### Redux Serialization
Serialization checks are disabled for Firebase Timestamp objects and persist actions. This is configured in [store/index.js](store/index.js).
