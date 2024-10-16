import { createReducer } from '@reduxjs/toolkit';
const initialState = {
    loading: false,
    market: null,
    market2: null,
    marketPage: 1,
    hot7: null,
    hot30: null,
    cold7: null,
    cold30: null,
    error: {}
}
export const marketReducer = createReducer(initialState, (builder) => {
  builder.addCase("fetchHotCoinsSuccess", (state, action) => {
    state.loading = false;
    state.hot7 = action.payload.orderedHot7;
    state.hot30 = action.payload.orderedHot30;
  })
  .addCase("fetchColdCoinsSuccess", (state, action) => {
    state.loading = false;
    state.cold7 = action.payload.orderedCold7;
    state.cold30 = action.payload.orderedCold30;
  })
  builder.addCase("fetchHotCoinsFail", (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })
  .addCase("fetchColdCoinsFail", (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
  builder.addCase("getMarketSuccess", (state, action) => {
    state.loading = false;
    state.market = action.payload;
    state.error = {};
  });
  builder.addCase("getMarket2Success", (state, action) => {
    state.loading = false;
    state.market2 = action.payload;
    state.error = {};
  });
  builder.addCase("updateMarketPage", (state, action) => {
    state.marketPage = action.payload;
  });
});