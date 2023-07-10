import { createReducer } from '@reduxjs/toolkit';
 
 const initialState = {
     loading: true,
     portfolio: null,
     total: null,
     error: {}
 }
 
 export const portfolioReducer = createReducer(initialState, (builder) => {
  builder.addCase("addCoinSuccess", (state) => {
    state.loading = false;
  });
  builder.addCase("deleteCoinSuccess", (state, action) => {
    const filteredPortfolio = state.portfolio.filter(item => item.id !== action.payload);
    state.loading = false;
    state.portfolio = filteredPortfolio;
  });
  builder.addCase("fetchPortfolioSuccess", (state, action) => {
    state.loading = false;
    state.portfolio = action.payload;
  });
  builder.addCase("updateTotalSuccess", (state, action) => {
    state.loading = false;
    state.total = action.payload;
  });
  builder.addCase("fetchPortfolioFail", (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })
  .addCase("addCoinFail", (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })
  .addCase("deleteCoinFail", (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
  builder.addCase("fetchTotal", (state, action) => {
    state.loading = false;
    state.total = action.payload;
  });
  builder.addCase("clearPortfolio", (state) => {
    state.loading = false;
    state.portfolio = null;
    state.total = null;
    state.error = {};
  });
  builder.addCase("updatePrices", (state) => {
    state.loading = false;
  });
 })