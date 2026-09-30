import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import salesReducer from 'store/sales/reducer/root.reducer';
import prmReducer from 'store/prm/reducer/root.reducer';
import automatedClearingMiddleware from 'store/middleware/automatedClearingMiddleware';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore } from 'redux-persist';

const rootReducer = combineReducers({
  ...salesReducer, prmReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 128, // optional: reduce strictness
      },
    }).concat(automatedClearingMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = any> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;