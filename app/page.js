"use client";
import Image from 'next/image';
import Link from 'next/link';
import logoWhite from '../assets/crypto-crossing-logo-white.png';
import iconLogo from '../assets/crypto-crossing-icon.png';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from "next/navigation";
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { setUser, loginAnon } from '@/store/actions/authAction';

const navigation = [
  { name: 'Portfolio', href: '#features' },
  { name: 'Markets', href: '#markets' },
  { name: 'News', href: '#features' },
];

// CoinGecko ids for every coin shown in the hero + ticker — fetched in a
// single request to stay well under the API's rate limit.
const COIN_IDS = [
  'bitcoin', 'ethereum', 'solana', 'ripple', 'chainlink',
  'cardano', 'dogecoin', 'polkadot', 'matic-network', 'avalanche-2',
];
const MARKETS_API =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' +
  COIN_IDS.join(',') +
  '&order=market_cap_desc&sparkline=false&price_change_percentage=24h&precision=2';

// Seed values so the hero renders instantly and survives a rate-limited API.
const initialHoldings = [
  { symbol: 'BTC', name: 'Bitcoin', id: 'bitcoin', amount: 0.42, price: 61240, change24: 1.8 },
  { symbol: 'ETH', name: 'Ethereum', id: 'ethereum', amount: 3.1, price: 3382, change24: 2.4 },
  { symbol: 'SOL', name: 'Solana', id: 'solana', amount: 28, price: 146.5, change24: -0.9 },
  { symbol: 'LINK', name: 'Chainlink', id: 'chainlink', amount: 120, price: 14.28, change24: 3.1 },
];

const initialTicker = [
  { symbol: 'BTC', id: 'bitcoin', price: 61240, change: 1.8 },
  { symbol: 'ETH', id: 'ethereum', price: 3382, change: 2.4 },
  { symbol: 'SOL', id: 'solana', price: 146.5, change: -0.9 },
  { symbol: 'XRP', id: 'ripple', price: 0.52, change: 0.6 },
  { symbol: 'LINK', id: 'chainlink', price: 14.28, change: 3.1 },
  { symbol: 'ADA', id: 'cardano', price: 0.39, change: -1.4 },
  { symbol: 'DOGE', id: 'dogecoin', price: 0.12, change: 4.2 },
  { symbol: 'DOT', id: 'polkadot', price: 6.1, change: -0.3 },
  { symbol: 'MATIC', id: 'matic-network', price: 0.58, change: 1.1 },
  { symbol: 'AVAX', id: 'avalanche-2', price: 27.4, change: -2.0 },
];

const money = (n, d = 2) =>
  (Number.isFinite(n) ? n : 0).toLocaleString('en-US', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });

const features = [
  {
    kicker: 'Portfolio',
    title: 'Track everything you hold',
    body: 'Add your holdings once. Watch their combined value move against live market prices, updated as you go.',
  },
  {
    kicker: 'News',
    title: "Read what's moving the market",
    body: 'Bitcoin, Ethereum, alt-coins, and general market stories pulled together into one feed you can scan in seconds.',
  },
  {
    kicker: 'Markets',
    title: 'Follow the whole market',
    body: 'Prices across days, weeks, and months, so you can read the trend before you decide to act on it.',
  },
  {
    kicker: 'Signals',
    title: 'Spot the trend early',
    body: 'Surface the coins climbing and falling fastest, so you can time your next move with the market instead of behind it.',
  },
];

export default function Home() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [holdings, setHoldings] = useState(initialHoldings);
  const [ticker, setTicker] = useState(initialTicker);
  const [live, setLive] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    dispatch(setUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push('/portfolio');
    }
  }, [isAuthenticated, loading, router]);

  // Real prices from CoinGecko: one request on mount, refreshed every 60s to
  // stay rate-limit-safe. Falls back to seed values if the API is unavailable.
  useEffect(() => {
    let cancelled = false;

    const fetchLive = async () => {
      try {
        const res = await fetch(MARKETS_API);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !Array.isArray(data)) return;

        const byId = Object.fromEntries(data.map((c) => [c.id, c]));
        setHoldings((prev) =>
          prev.map((coin) => {
            const m = byId[coin.id];
            return m && Number.isFinite(m.current_price)
              ? { ...coin, price: m.current_price, change24: m.price_change_percentage_24h ?? coin.change24 }
              : coin;
          })
        );
        setTicker((prev) =>
          prev.map((coin) => {
            const m = byId[coin.id];
            return m && Number.isFinite(m.current_price)
              ? { ...coin, price: m.current_price, change: m.price_change_percentage_24h ?? coin.change }
              : coin;
          })
        );
        setLive(true);
      } catch {
        // Keep the seeded values — the hero should never look broken.
      }
    };

    fetchLive();
    const refresh = setInterval(fetchLive, 60000);
    return () => {
      cancelled = true;
      clearInterval(refresh);
    };
  }, []);

  // Between refreshes, nudge prices so the numbers visibly breathe. Motion only.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => {
      setHoldings((prev) =>
        prev.map((coin) => {
          const drift = (Math.random() - 0.48) * 0.0025;
          return { ...coin, price: coin.price * (1 + drift), dir: drift >= 0 ? 'up' : 'down' };
        })
      );
      setTick((t) => t + 1);
    }, 1600);

    return () => clearInterval(id);
  }, []);

  const total = holdings.reduce((sum, c) => sum + c.amount * c.price, 0);

  const handleLoginAnon = async () => {
    await dispatch(loginAnon());
    router.push('/portfolio');
  };

  return (
    <main className="bg-paper text-ink">
      {/* ============ Hero (dark) ============ */}
      <div
        className="relative overflow-hidden bg-ink text-white"
        style={{
          backgroundImage:
            'radial-gradient(60% 55% at 78% 12%, rgba(68,210,218,0.16), transparent 60%), radial-gradient(50% 40% at 8% 0%, rgba(68,210,218,0.08), transparent 55%)',
        }}
      >
        <header className="relative z-50">
          <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Crypto Crossing</span>
                <Image src={logoWhite} alt="Crypto Crossing" className="h-10 w-auto" priority />
              </a>
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white/80"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-10">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-white/70 transition hover:text-white"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-3">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 transition hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-ink transition hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                Create account
              </Link>
            </div>
          </nav>

          <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-ink px-6 py-6 text-white sm:max-w-sm sm:ring-1 sm:ring-white/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">Crypto Crossing</span>
                  <Image className="h-9 w-auto" src={iconLogo} alt="Crypto Crossing" />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-white/80"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-8 flow-root">
                <div className="-my-6 divide-y divide-white/10">
                  <div className="space-y-1 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium text-white/80 hover:bg-white/5"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="space-y-2 py-6">
                    <Link href="/login" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-white/80 hover:bg-white/5">
                      Log in
                    </Link>
                    <Link href="/register" className="-mx-3 block rounded-lg bg-teal px-3 py-2.5 text-base font-semibold text-ink">
                      Create account
                    </Link>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </header>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-16 pt-16 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-24 lg:pt-24">
          {/* Left: thesis */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-teal">
              Portfolio · Markets · News
            </p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.03] tracking-tight sm:text-6xl">
              Every coin you hold,
              <br />
              counted in real time.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              Crypto Crossing brings your whole portfolio, live market prices, and
              the news that moves them into one place.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="rounded-xl bg-teal px-6 py-3.5 text-base font-semibold text-ink transition hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                Create account
              </Link>
              <button
                onClick={handleLoginAnon}
                className="rounded-xl border border-white/15 px-6 py-3.5 text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal"
              >
                Try it as a guest
              </button>
            </div>
            <p className="mt-5 font-mono text-xs text-white/40">
              No wallet connection. No card. Your holdings stay yours.
            </p>
          </div>

          {/* Right: the product, live */}
          <div className="lg:justify-self-end">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface/80 p-6 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                  Portfolio value
                </span>
                <span className={`flex items-center gap-1.5 text-[11px] font-medium ${live ? 'text-up' : 'text-white/40'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${live ? 'animate-pulse bg-up' : 'bg-white/40'}`} />
                  {live ? 'Live' : 'Demo'}
                </span>
              </div>
              <div
                key={`total-${tick}`}
                className="mt-2 font-mono text-4xl font-semibold tabular-nums text-white"
              >
                ${money(total)}
              </div>

              <div className="mt-6 space-y-1">
                {holdings.map((coin) => {
                  const value = coin.amount * coin.price;
                  const up = coin.dir !== 'down';
                  const up24 = (coin.change24 ?? 0) >= 0;
                  return (
                    <div
                      key={coin.symbol}
                      className="flex items-center justify-between rounded-lg px-2 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/5 font-mono text-[10px] font-semibold text-teal">
                          {coin.symbol}
                        </span>
                        <div className="leading-tight">
                          <div className="text-sm font-medium text-white">{coin.name}</div>
                          <div className="font-mono text-xs tabular-nums text-white/40">
                            {coin.amount} {coin.symbol}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          key={`${coin.symbol}-${tick}`}
                          className={`rounded px-1 font-mono text-sm font-medium tabular-nums text-white ${
                            coin.dir ? (up ? 'flash-up' : 'flash-down') : ''
                          }`}
                        >
                          ${money(value)}
                        </div>
                        <div
                          className={`font-mono text-xs tabular-nums ${up24 ? 'text-up' : 'text-down'}`}
                        >
                          {up24 ? '▲' : '▼'} {up24 ? '+' : ''}{(coin.change24 ?? 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Ticker strip — the crossing */}
        <div id="markets" className="marquee border-y border-white/10 bg-ink-2 py-3">
          <div className="marquee-track">
            {[...ticker, ...ticker].map((coin, i) => {
              const up = coin.change >= 0;
              return (
                <span
                  key={`${coin.symbol}-${i}`}
                  className="mx-6 inline-flex items-center gap-2 font-mono text-sm tabular-nums"
                >
                  <span className="font-semibold text-white/80">{coin.symbol}</span>
                  <span className="text-white/50">${money(coin.price, coin.price < 1 ? 4 : 2)}</span>
                  <span className={up ? 'text-up' : 'text-down'}>
                    {up ? '+' : ''}
                    {coin.change.toFixed(1)}%
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============ Features (light) ============ */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-teal-600">
            One place
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            Everything you track, without the tabs.
          </h2>
          <p className="mt-4 text-lg text-ink/60">
            Portfolio, markets, and news each answer a different question. Crypto
            Crossing keeps all three in view so you never trade on a hunch.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-ink/10 bg-white p-8 transition hover:border-teal/50 hover:shadow-lg hover:shadow-teal/5"
            >
              <span className="absolute left-0 top-8 h-8 w-1 rounded-r bg-teal opacity-0 transition group-hover:opacity-100" />
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-teal-600">
                {f.kicker}
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{f.title}</h3>
              <p className="mt-3 leading-relaxed text-ink/60">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4 rounded-2xl bg-ink px-8 py-7 text-white">
          <p className="font-display text-xl font-semibold sm:text-2xl">
            Start with the coins you already own.
          </p>
          <div className="ml-auto flex gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-teal px-5 py-3 text-sm font-semibold text-ink transition hover:bg-teal-600"
            >
              Create account
            </Link>
            <button
              onClick={handleLoginAnon}
              className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Try as guest
            </button>
          </div>
        </div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="bg-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-14 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Image src={logoWhite} alt="Crypto Crossing" className="h-9 w-auto" />
          <p className="font-mono text-xs tabular-nums text-white/40">
            Built with React · Next.js · Redux · Firebase · CoinGecko API
          </p>
        </div>
      </footer>
    </main>
  );
}
