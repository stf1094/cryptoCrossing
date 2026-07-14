// Market actions — read-only market data pulled from the public CoinGecko API
// and dispatched into the `market` slice (store/reducers/market.js). None of
// these touch Firestore or the signed-in user; they power the /market page.

// updateMarketPage — remembers which page of the market table the user is on.
// Purely UI state persisted in the market slice so the page survives navigation.
export const updateMarketPage = (page) => async dispatch => {
    await dispatch({type: "updateMarketPage", payload: page});
}

// getMarket — fetches the top 500 coins by market cap from CoinGecko in two
// pages of 250 (the API's per-page max). Each page is normalized down to the
// handful of fields the UI needs (id, name, image, rank, price, 24h/7d/30d
// change) and dispatched separately as `getMarketSuccess` / `getMarket2Success`.
// A 1s delay is inserted between the two requests to dodge CoinGecko rate limits.
export const getMarket = () => async dispatch => {
    let market = [];
    let market2 = [];
    const config = {
        headers: {
            'Access-Control-Allow-Origin': 'https://api.coingecko.com/api/v3',
        }
      }
      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=3`)
        .then((res) => res.json())
        .then((data) => {
            data.forEach((item) => {
                market.push({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    rank: item.market_cap_rank,
                    price: item.current_price,
                    change7: item.price_change_percentage_7d_in_currency ? Number(item.price_change_percentage_7d_in_currency) : 0.000,
                    change30: item.price_change_percentage_30d_in_currency ? Number(item.price_change_percentage_30d_in_currency) : 0.000,
                    change: item.price_change_percentage_24h_in_currency ? item.price_change_percentage_24h_in_currency : 0.000
                })
            })
        });
        await dispatch({type: "getMarketSuccess", payload: market});
    } catch (err) {
        console.error(err.message);
    }

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=2&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=3`)
        const responseData = await res.json();

        if (responseData?.status?.error_message) {
          console.error('CoinGecko API Error (Page 2):', responseData.status.error_message);
        }

        if (Array.isArray(responseData)) {
          responseData.forEach((item) => {
              market2.push({
                  id: item.id,
                  name: item.name,
                  image: item.image,
                  rank: item.market_cap_rank,
                  price: item.current_price,
                  change7: item.price_change_percentage_7d_in_currency ? Number(item.price_change_percentage_7d_in_currency) : 0.000,
                  change30: item.price_change_percentage_30d_in_currency ? Number(item.price_change_percentage_30d_in_currency) : 0.000,
                  change: item.price_change_percentage_24h_in_currency ? item.price_change_percentage_24h_in_currency : 0.000
              })
          })
        }

        await dispatch({type: "getMarket2Success", payload: market2});
    } catch (err) {
        console.error('Error fetching page 2:', err?.message || err);
        dispatch({type: "getMarket2Fail", payload: err?.message || 'Unknown error'});
    }

}

// getHotColdCoins — scans one page of CoinGecko market data and buckets coins
// into "hot" (big gainers) and "cold" (big losers) over 7d and 30d windows using
// fixed % thresholds, then sorts each bucket most-extreme-first. Feeds the
// trending sliders via `fetchHotCoinsSuccess` / `fetchColdCoinsSuccess`.
export const getHotColdCoins = (page) => async dispatch => {
    const hot7 = [];
    const cold7 = [];
    const hot30 = [];
    const cold30 = [];
    const config = {
        headers: {
            'Access-Control-Allow-Origin': 'https://api.coingecko.com/api/v3',
        }
      }
    const res = fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}&sparkline=false&price_change_percentage=24h%2C7d%2C30d&locale=en&precision=2`)
    .then((res) => res.json())
    .then((data) => {
        data.forEach((item) => {
            //hot
            if (item.price_change_percentage_7d_in_currency > 20) {
                hot7.push(item);
            }
            if (item.price_change_percentage_30d_in_currency > 35) {
                hot30.push(item);
            }
            //cold
            if (item.price_change_percentage_7d_in_currency < -15) {
                cold7.push(item);
            }
            if (item.price_change_percentage_30d_in_currency < -30) {
                cold30.push(item);
            }
        })
    }).then(() => {
        // order hot and cold
        const orderedHot7 = hot7.sort((a,b) =>
            a.price_change_percentage_7d_in_currency > b.price_change_percentage_7d_in_currency ? -1 * 1 : 1 * 1);
        const orderedHot30 = hot30.sort((a,b) =>
            a.price_change_percentage_30d_in_currency > b.price_change_percentage_30d_in_currency ? -1 * 1 : 1 * 1);
        const orderedCold7 = cold7.sort((a,b) =>
            a.price_change_percentage_7d_in_currency > b.price_change_percentage_7d_in_currency ? -1 * 1 : 1 * 1);
        const orderedCold30 = cold30.sort((a,b) =>
            a.price_change_percentage_30d_in_currency > b.price_change_percentage_30d_in_currency ? -1 * 1 : 1 * 1);
        // push hot and cold to reducer, action, etc...
        dispatch({type: "fetchHotCoinsSuccess", payload: {orderedHot7, orderedHot30}});
        dispatch({type: "fetchColdCoinsSuccess", payload: {orderedCold7, orderedCold30}});
    }).catch((error) => {
        console.error(error.message);
        dispatch({type: "fetchHotCoinsFail", payload: error.message});
        dispatch({type: "fetchColdCoinsFail", payload: error.message});
    })
}
