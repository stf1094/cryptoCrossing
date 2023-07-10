import { createReducer } from '@reduxjs/toolkit';
const initialState = {
    loading: false,
    news: null,
    btcNews: null,
    altsNews: null,
    error: {}
}
export const newsReducer = createReducer(initialState, (builder) => {
  builder.addCase("fetchGeneralNewsSuccess", (state, action) => {
    state.loading = false;
    state.news = action.payload;
  })
  .addCase("fetchBTCNewsSuccess", (state, action) => {
    state.loading = false;
    state.btcNews = action.payload;
  })
  .addCase("fetchAltsNewsSuccess", (state, action) => {
    state.loading = false;
    state.altsNews = action.payload;
  });
  builder.addCase("fetchGeneralNewsFail", (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })
  .addCase("fetchBTCNewsFail", (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })
  .addCase("fetchAltsNewsFail", (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
});