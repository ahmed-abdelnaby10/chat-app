import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistedReducer } from './rootReducer';
import { persistStore } from 'redux-persist';

export const store = configureStore({
    reducer: persistedReducer,
    devTools: import.meta.env.VITE_ENABLE_REDUX_DEV_TOOLS === 'true',
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST'],
            ignoredActionPaths: ['register', 'rehydrate'],
            ignoredPaths: ['some.nested.path']
        }
    })
});

export const useSelector = useReduxSelector;

export const persistor= persistStore(store);

export const useDispatch = () => useReduxDispatch();
