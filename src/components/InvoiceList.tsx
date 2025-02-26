import { useDispatch } from 'react-redux';
import { Button, List, ListItem, ListItemText } from '@mui/material';
import Link from 'next/link';
import { Invoice, LineItem } from '../types'; // Updated to include LineItem
import { deleteInvoice as deleteInvoiceAction } from '../redux/invoiceSlice';
import { deleteInvoice } from '../utils/api';

interface InvoiceListProps {
  invoices: Invoice[];
  onDeleteSuccess?: () => void; // Callback for delete success
}

export default function InvoiceList({ invoices, onDeleteSuccess }: InvoiceListProps) {
  const dispatch = useDispatch();

  // Calculate total amount for an invoice from lineItems
  const calculateTotalAmount = (invoice: Invoice): number => {
    return invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const handleDelete = async (id: number) => {
    await deleteInvoice(id);
    dispatch(deleteInvoiceAction(id));
    if (onDeleteSuccess) onDeleteSuccess();
  };

  return (
    <List>
      {invoices.map((invoice) => (
        <ListItem key={invoice.id} sx={{ bgcolor: '#fff', mb: 1, borderRadius: 1, boxShadow: 1 }}>
          <ListItemText
            primary={`${invoice.billTo} - $${calculateTotalAmount(invoice).toFixed(2)}`}
            secondary={`Date: ${new Date(invoice.date).toLocaleDateString()}, Payment Terms: ${invoice.paymentTerms}`} 
          />
          <Button component={Link} href={`/create-invoice?edit=${invoice.id}`} sx={{ mr: 2, backgroundColor: '#1E3A8A', color: '#fff', '&:hover': { backgroundColor: '#152e63' } }}>
            Edit
          </Button>
          <Button onClick={() => handleDelete(invoice.id!)} sx={{ backgroundColor: '#f44336', color: '#fff', '&:hover': { backgroundColor: '#da190b' } }}>
            Delete
          </Button>
        </ListItem>
      ))}
    </List>
  );
}