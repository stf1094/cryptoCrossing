import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducers/auth';
import { portfolioReducer } from './reducers/portfolio';
import { profileReducer } from './reducers/profile';
import { newsReducer } from './reducers/news';

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        portfolio: portfolioReducer,
        news: newsReducer
      },
      middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({serializableCheck: false}),
    });

export default store;