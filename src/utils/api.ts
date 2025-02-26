import { Invoice } from '@/types';
import axios from 'axios';

const API_URL = 'http://localhost:3001/invoices';

export const fetchInvoices = async () => (await axios.get(API_URL)).data;
export const createInvoice = async (invoice: Invoice) => (await axios.post(API_URL, invoice)).data;
export const updateInvoice = async (id: number, invoice: Invoice) =>
  (await axios.put(`${API_URL}/${id}`, invoice)).data;
export const deleteInvoice = async (id: number) => await axios.delete(`${API_URL}/${id}`);