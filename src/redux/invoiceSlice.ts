import { Invoice } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InvoiceState {
  invoices: Invoice[];
}

const initialState: InvoiceState = { invoices: [] };

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    setInvoices(state, action: PayloadAction<Invoice[]>) {
      state.invoices = action.payload;
    },
    addInvoice(state, action: PayloadAction<Invoice>) {
      state.invoices.push(action.payload);
    },
    updateInvoice(state, action: PayloadAction<Invoice>) {
      const index = state.invoices.findIndex((inv) => inv.id === action.payload.id);
      if (index !== -1) state.invoices[index] = action.payload;
    },
    deleteInvoice(state, action: PayloadAction<number>) {
      state.invoices = state.invoices.filter((inv) => inv.id !== action.payload);
    },
  },
});

export const { setInvoices, addInvoice, updateInvoice, deleteInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;