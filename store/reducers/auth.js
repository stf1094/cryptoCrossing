import { createReducer } from '@reduxjs/toolkit';
const initialState = {
   // token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: false,
    user: null,
    error: null,
}

export const authReducer = createReducer(initialState, (builder) => {
    builder.addCase("loginRequest", (state) => {
        state.loading = true;
    })
    .addCase("loadUserRequest", (state) => {
        state.loading = true;
    })
    .addCase("logoutRequest", (state) => {
        state.loading = true;
    })
    .addCase("registerRequest", (state) => {
        state.loading = true;
    });
    builder.addCase("setLoadingFalse", (state) => {
        state.loading = false;
    });
    builder.addCase("forgotPasswordEmailSuccess", (state) => {
        state.loading = false;
    });
    builder.addCase("loginSuccess", (state) => {
        state.loading = false;
        state.isAuthenticated = true;
    })
    .addCase("loginAnonSuccess", (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
    })
    .addCase("registerSuccess", (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
    })
    .addCase("logoutSuccess", (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
    })
    .addCase("loadUserSuccess", (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
    });
    builder.addCase("loadUserFail", (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
    })
    .addCase("loginFail", (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
    })
    .addCase("registerFail", (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
    })
    .addCase("logoutFail", (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = action.payload;
    }); 
    builder.addCase("forgotPasswordEmailFail", (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
    });
});