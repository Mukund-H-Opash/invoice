export const saveInvoice = async (data: {
  customerName: string;
  shippingAddress: string;
  items: { item: string; quantity: number; rate: number; amount: number }[];
  discount: number;
  tax: number;
  shippingCharge: number;
  total: number;
  amount: string;
  dueDate: string;
  date: string;
  id?: string;
}) => {
  try {
    const response = await fetch('http://localhost:3001/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: data.id || Date.now().toString().slice(-4),
        customerName: data.customerName,
        shippingAddress: data.shippingAddress,
        items: data.items,
        discount: data.discount,
        tax: data.tax,
        shippingCharge: data.shippingCharge,
        total: data.total,
        amount: data.amount,
        dueDate: data.dueDate,
        date: data.date,
      }),
    });
    if (!response.ok) throw new Error('Failed to save invoice');
    const result = await response.json();
    console.log('Invoice saved:', result);
    return result;
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw error;
  }
};

export const fetchInvoices = async () => {
  try {
    const response = await fetch('http://localhost:3001/invoices');
    if (!response.ok) throw new Error('Failed to fetch invoices');
    const data = await response.json();
    // Ensure all fields are present, fallback to defaults if missing
    return data.map((invoice: any) => ({
      ...invoice,
      shippingAddress: invoice.shippingAddress || '',
      items: invoice.items || [{ item: '', quantity: 0, rate: 0, amount: 0 }],
      discount: invoice.discount || 0,
      tax: invoice.tax || 0,
      shippingCharge: invoice.shippingCharge || 0,
      total: invoice.total || parseFloat(invoice.amount) || 0,
      date: invoice.date || new Date().toLocaleDateString('en-GB'),
    }));
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};

export const updateInvoice = async (
  id: string,
  data: {
    customerName: string;
    shippingAddress: string;
    items: { item: string; quantity: number; rate: number; amount: number }[];
    discount: number;
    tax: number;
    shippingCharge: number;
    total: number;
    amount: string;
    dueDate: string;
    date: string;
  }
) => {
  try {
    const response = await fetch(`http://localhost:3001/invoices/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        customerName: data.customerName,
        shippingAddress: data.shippingAddress,
        items: data.items,
        discount: data.discount,
        tax: data.tax,
        shippingCharge: data.shippingCharge,
        total: data.total,
        amount: data.amount,
        dueDate: data.dueDate,
        date: data.date,
      }),
    });
    if (!response.ok) throw new Error('Failed to update invoice');
    return await response.json();
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

export const deleteInvoice = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3001/invoices/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete invoice');
    return true;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return false;
  }
};