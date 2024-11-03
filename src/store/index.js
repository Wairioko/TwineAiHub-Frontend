import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import chatActions from './chatActions';


const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['messages'] 
};


const persistedReducer = persistReducer(persistConfig, chatActions);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            },
        }),
});


export const persistor = persistStore(store);

