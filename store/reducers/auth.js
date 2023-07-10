import { createReducer } from '@reduxjs/toolkit';
const initialState = {
   // token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: false,
    user: null
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
});

/* export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            }
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
        case LOGIN_ANON_SUCCESS:
           // localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGIN_ANON_FAIL:
        case LOGOUT:
        case ACCOUNT_DELETED:
           // localStorage.removeItem('token');
            return {
                ...state,
               // token: null,
                isAuthenticated: false,
                loading: false,
                user: null
            }
        default:
            return state;
    }
} */
