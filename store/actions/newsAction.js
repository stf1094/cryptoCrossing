// News is served by our own cached route handler (app/api/news/route.js),
// which pulls from CryptoCompare's free API. One request returns all three
// categories, so we fetch once and fan the result out to the existing
// general / bitcoin / alts reducer actions.
export const fetchAllNews = () => async (dispatch) => {
  dispatch({ type: 'fetchGeneralNewsRequest' });
  dispatch({ type: 'fetchBTCNewsRequest' });
  dispatch({ type: 'fetchAltsNewsRequest' });

  try {
    const res = await fetch('/api/news');
    if (!res.ok) throw new Error(`News request failed (${res.status})`);

    const { news, btcNews, altsNews } = await res.json();

    dispatch({ type: 'fetchGeneralNewsSuccess', payload: news });
    dispatch({ type: 'fetchBTCNewsSuccess', payload: btcNews });
    dispatch({ type: 'fetchAltsNewsSuccess', payload: altsNews });
  } catch (error) {
    console.error(error.message);
    dispatch({ type: 'fetchGeneralNewsFail', payload: error.message });
    dispatch({ type: 'fetchBTCNewsFail', payload: error.message });
    dispatch({ type: 'fetchAltsNewsFail', payload: error.message });
  }
};
