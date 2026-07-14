"use client";
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { useSelector } from 'react-redux';

// The rail only needs the top handful of coins. Prefer the (persisted) market
// slice if it's already populated; otherwise make one lightweight top-8 request
// so we never trigger the heavier 2-page getMarket() and its rate-limit-prone
// page-2 fetch.
const TOP_COINS_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1&sparkline=false&price_change_percentage=24h';

const fetcher = (url) => fetch(url).then((res) => res.json());

// Normalise both the mapped market-slice shape and the raw CoinGecko shape.
const toRow = (c) => ({
  id: c.id,
  name: c.name,
  image: c.image,
  rank: c.rank ?? c.market_cap_rank,
  price: c.price ?? c.current_price,
  change: c.change ?? c.price_change_percentage_24h_in_currency ?? c.price_change_percentage_24h ?? 0,
});

const formatPrice = (price) => {
  if (typeof price !== 'number') return '—';
  const maximumFractionDigits = price >= 1 ? 2 : 6;
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits });
};

function MarketRail() {
  const { market } = useSelector((state) => state.market);
  // Only fetch when the market slice isn't already available.
  const { data } = useSWR(market ? null : TOP_COINS_URL, fetcher);

  const source = market ?? (Array.isArray(data) ? data : null);
  const coins = source ? source.slice(0, 8).map(toRow) : [];

  return (
    <aside className="lg:sticky lg:top-6">
      <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Markets</h2>
          <span className="rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-teal">
            Live
          </span>
        </div>

        <ul className="mt-4 divide-y divide-ink/5">
          {coins.length === 0 &&
            Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <div className="h-7 w-7 animate-pulse rounded-full bg-ink/5" />
                <div className="h-3 flex-1 animate-pulse rounded bg-ink/5" />
                <div className="h-3 w-12 animate-pulse rounded bg-ink/5" />
              </li>
            ))}

          {coins.map((coin) => (
            <li key={coin.id} className="flex items-center gap-3 py-3">
              <Image
                src={coin.image}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 shrink-0 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{coin.name}</p>
                <p className="text-xs text-ink/40">#{coin.rank}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm tabular-nums text-ink">${formatPrice(coin.price)}</p>
                <p className={`font-mono text-xs tabular-nums ${coin.change >= 0 ? 'green' : 'red'}`}>
                  {coin.change >= 0 ? '+' : ''}
                  {Number(coin.change).toFixed(2)}%
                </p>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/market"
          className="mt-4 flex items-center justify-center rounded-xl bg-ink py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal hover:text-ink"
        >
          View full market →
        </Link>
      </div>
    </aside>
  );
}

export default MarketRail;
