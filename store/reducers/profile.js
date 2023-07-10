import { createReducer } from '@reduxjs/toolkit';
 
 const initialState = {
     profile: null,
     loading: true,
     error: {}
 }
 
 export const profileReducer = createReducer(initialState, (builder) => {
  builder.addCase("getProfileSuccess", (state, action) => {
    state.loading = false;
    state.profile = action.payload;
  });
  builder.addCase("updateProfile", (state, action) => {
     state.loading = false;
     state.profile = action.payload;
  });
  builder.addCase("clearProfile", (state) => {
    state.loading = false;
    state.profile = null;
    state.error = {};
  });
  builder.addCase("profileError", (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
});