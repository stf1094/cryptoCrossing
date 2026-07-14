import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

// Refresh the upstream feeds at most once every 15 minutes. The response is
// shared across all users, so each feed is hit ~96 times/day regardless of
// traffic.
export const revalidate = 900;

// rss-parser depends on Node APIs, so pin this route to the Node.js runtime.
export const runtime = 'nodejs';

const FEEDS = [
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
  { url: 'https://cointelegraph.com/rss', source: 'Cointelegraph' },
  { url: 'https://decrypt.co/feed', source: 'Decrypt' },
];

// RSS thumbnails live in a few different (optional) places depending on the
// feed, so we register the custom fields and probe each in turn.
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

function pickImage(item) {
  const mediaContent = item.mediaContent?.[0]?.$?.url;
  const mediaThumbnail = item.mediaThumbnail?.$?.url;
  const enclosure = item.enclosure?.url;
  const inline = item.contentEncoded?.match(/<img[^>]+src="([^"]+)"/i)?.[1];
  return mediaContent || mediaThumbnail || enclosure || inline || null;
}

// Map an RSS item onto the shape our NewsItem component expects
// ({ id, url, text, image, title, source }); `date` is used for sorting only
// and stripped before the response is returned.
function toArticle(item, source) {
  return {
    id: item.guid || item.link,
    title: item.title ?? '',
    url: item.link ?? '',
    text: (item.contentSnippet ?? '').slice(0, 300),
    image: pickImage(item),
    source,
    date: item.isoDate ? Date.parse(item.isoDate) : 0,
  };
}

// RSS feeds have no category metadata, so bucket articles by keyword match
// against the title and snippet.
const BTC_RE = /\b(bitcoin|btc)\b/i;
const ALT_RE = /\b(ethereum|eth|solana|sol|xrp|cardano|ada|altcoin|dogecoin|bnb)\b/i;
const matches = (a, re) => re.test(`${a.title} ${a.text}`);

const stripDate = ({ date, ...rest }) => rest;

export async function GET() {
  try {
    const settled = await Promise.allSettled(
      FEEDS.map(async (feed) => {
        const parsed = await parser.parseURL(feed.url);
        return parsed.items.map((item) => toArticle(item, feed.source));
      })
    );

    // Keep whatever feeds succeeded; one dead feed shouldn't blank the page.
    const articles = settled
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r) => r.value)
      .sort((a, b) => b.date - a.date);

    if (articles.length === 0) {
      return NextResponse.json({ error: 'All news feeds are unavailable' }, { status: 502 });
    }

    return NextResponse.json({
      news: articles.map(stripDate),
      btcNews: articles.filter((a) => matches(a, BTC_RE)).map(stripDate),
      altsNews: articles.filter((a) => matches(a, ALT_RE)).map(stripDate),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
