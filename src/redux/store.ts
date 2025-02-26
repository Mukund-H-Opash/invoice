import { configureStore } from '@reduxjs/toolkit';
import invoiceReducer from './invoiceSlice';

export const store = configureStore({
  reducer: {
    invoices: invoiceReducer, // Matches the slice name from invoiceSlice.ts
  },
});

// TypeScript types for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;