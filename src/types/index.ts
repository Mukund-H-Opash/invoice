export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  companyName: any;
  name: any;
  id?: number;
  from: string;
  billTo: string;
  shipTo?: string;
  paymentTerms: string;
  dueDate: string;
  poNumber?: string;
  lineItems: LineItem[];
  notes?: string;
  terms?: string;
  subtotal: number;
  tax: number;
  discount: number;
  shipping: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  date: string;
}