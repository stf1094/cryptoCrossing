import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'reduxjs-toolkit-persist';
import storage from 'reduxjs-toolkit-persist/lib/storage'
import { authReducer } from './reducers/auth';
import { portfolioReducer } from './reducers/portfolio';
import { profileReducer } from './reducers/profile';
import { newsReducer } from './reducers/news';
import { marketReducer } from './reducers/market';

const persistConfig = {
  key: "root", 
  version: 1,   
  storage: storage,
  whitelist: ['auth']
}; 

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  portfolio: portfolioReducer,
  news: newsReducer,
  market: marketReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
    ignoredActions: [
      FLUSH,
      REHYDRATE,
      PAUSE,
      PERSIST,
      PURGE,
      REGISTER
    ],
  }),
});

/* const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        portfolio: portfolioReducer,
        news: newsReducer,
        market: marketReducer,
      },
      middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({serializableCheck: false}),
    }); */

export default store;