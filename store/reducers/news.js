import { createReducer } from '@reduxjs/toolkit';
const initialState = {
    loading: false,
    news: null,
    btcNews: null,
    altsNews: null,
    error: {}
}
export const newsReducer = createReducer(initialState, (builder) => {
  // Request actions - set loading to true
  builder.addCase("fetchGeneralNewsRequest", (state) => {
    state.loading = true;
  })
  .addCase("fetchBTCNewsRequest", (state) => {
    state.loading = true;
  })
  .addCase("fetchAltsNewsRequest", (state) => {
    state.loading = true;
  });

  // Success actions - set loading to false and update data
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

  // Fail actions - set loading to false and update error
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