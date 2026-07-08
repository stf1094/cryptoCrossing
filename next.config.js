/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Coin logos come from CoinGecko's CDN and news thumbnails from many
    // arbitrary hosts. Serving images unoptimized keeps next/image's
    // lazy-loading and layout-stability (width/height) benefits without
    // whitelisting every remote domain or consuming image-optimization quota.
    unoptimized: true,
  },
}

module.exports = nextConfig
