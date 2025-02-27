import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Item {
  item: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  customerName: string;
  shippingAddress: string;
  items: Item[];
  discount: number;
  tax: number;
  shippingCharge: number;
  total: number;
  amount: string; // Kept as string to match API consistency
  dueDate: string;
  date: string;
}

interface InvoiceState {
  invoices: Invoice[];
}

const initialState: InvoiceState = {
  invoices: [],
};

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    // Add a new invoice to the state
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices.push(action.payload);
    },
    // Update an existing invoice by ID
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.invoices.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
    },
    // Delete an invoice by ID
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.invoices = state.invoices.filter(
        (invoice) => invoice.id !== action.payload
      );
    },
    // Set all invoices (e.g., after fetching from API)
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.invoices = action.payload;
    },
  },
});

export const { addInvoice, updateInvoice, deleteInvoice, setInvoices } =
  invoiceSlice.actions;

export default invoiceSlice.reducer;