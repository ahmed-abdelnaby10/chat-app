import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { reducer as userReducer } from './slices/userSlice';
import { reducer as authReducer } from './slices/authSlice';

const persistConfig = {
    key: 'ChatApp',
    storage,
};

const rootReducer = combineReducers({
    user: userReducer,
    isAuthenticated: authReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;