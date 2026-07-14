import { NextResponse } from 'next/server';

// Refresh the upstream feed at most once every 15 minutes. The response is
// shared across all users, so CryptoCompare is hit ~96 times/day regardless of
// traffic — well within its keyless free limits.
export const revalidate = 900;

const CRYPTOCOMPARE_NEWS = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN';

// Map a CryptoCompare article onto the shape our NewsItem component expects
// ({ id, url, text, image, title, source }).
function mapArticle(a) {
  return {
    id: String(a.id),
    title: a.title,
    url: a.url,
    text: a.body,
    image: a.imageurl,
    source: a.source_info?.name || a.source,
  };
}

// CryptoCompare tags each article with pipe-delimited categories, e.g.
// "BTC|Trading|Market". We use those to fill the Bitcoin / Alt Coins tabs.
function hasCategory(a, category) {
  return (
    typeof a.categories === 'string' &&
    a.categories.split('|').includes(category)
  );
}

export async function GET() {
  const apiKey = process.env.CRYPTOCOMPARE_API_KEY;
  const url = CRYPTOCOMPARE_NEWS + (apiKey ? `&api_key=${apiKey}` : '');

  try {
    const res = await fetch(url, { next: { revalidate } });

    if (!res.ok) {
      return NextResponse.json(
        { error: `CryptoCompare responded ${res.status}` },
        { status: 502 }
      );
    }

    const json = await res.json();
    const articles = Array.isArray(json?.Data) ? json.Data : [];

    return NextResponse.json({
      news: articles.map(mapArticle),
      btcNews: articles.filter((a) => hasCategory(a, 'BTC')).map(mapArticle),
      altsNews: articles.filter((a) => hasCategory(a, 'ALTCOIN')).map(mapArticle),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
