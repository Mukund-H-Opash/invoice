'use client';
import { useEffect, useState } from 'react';
import { Box, Typography, Button, Divider, Paper, TextField, Grid } from '@mui/material';
import { useRouter, useParams } from 'next/navigation'; // No need for `use` import from React
import { fetchInvoices } from '../../../utils/api';
import { Invoice, LineItem } from '@/types';
import Navbar from '../../../components/Navbar';

export default function InvoiceDetails() {
  // Use useParams to get params, which returns a plain object
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const router = useRouter();

  // Safely access id from params, with type checking
  const id = params?.id ? String(params.id) : null;

  // If id is null or undefined, show loading or error state
  if (!id) return <Typography>Error: Invalid invoice ID</Typography>;

  useEffect(() => {
    const loadInvoice = async () => {
      const invoices = await fetchInvoices();
      const foundInvoice = invoices.find((inv: Invoice) => inv.id === Number(id));
      setInvoice(foundInvoice || null);
    };
    loadInvoice();
  }, [id]); // Use id from params

  if (!invoice) return <Typography>Loading...</Typography>;

  const calculateTotalAmount = (invoice: Invoice): number => {
    return invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#0A0A0A', p: 2 }}>
      <Navbar />
      <Paper sx={{ p: 4, mt: 2, bgcolor: '#1F2937', borderRadius: 2, boxShadow: 1, maxWidth: '800px', mx: 'auto', color: '#E5E7EB' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ flex: 1, textAlign: 'right' }}>
            <Typography variant="h4" sx={{ color: '#4CAF50' }}>INVOICE</Typography>
            <Typography variant="h6" sx={{ color: '#E5E7EB' }}># {invoice.id}</Typography>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Who is this from?"
              value={invoice.from}
              disabled
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <TextField
              fullWidth
              label="Bill To"
              value={invoice.billTo}
              disabled
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', mt: 2, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <TextField
              fullWidth
              label="Ship To (optional)"
              value={invoice.shipTo || ''}
              disabled
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', mt: 2, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date"
              value={new Date(invoice.date).toLocaleDateString()}
              disabled
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <TextField
              fullWidth
              label="Payment Terms"
              value={invoice.paymentTerms}
              disabled
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', mt: 2, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <TextField
              fullWidth
              label="Due Date"
              value={invoice.dueDate}
              disabled
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', mt: 2, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <TextField
              fullWidth
              label="PO Number (optional)"
              value={invoice.poNumber || ''}
              disabled
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', mt: 2, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4, borderColor: '#4A5568' }} />

        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', bgcolor: '#1E3A8A', color: '#E5E7EB', p: 2, borderRadius: 1 }}>
            <Typography>Item</Typography>
            <Typography>Quantity</Typography>
            <Typography>Rate</Typography>
            <Typography>Amount</Typography>
          </Box>
          {invoice.lineItems.map((item, index) => (
            <Box key={index} sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', p: 2, borderBottom: '1px solid #4A5568', color: '#E5E7EB' }}>
              <Typography>{item.description || 'Service Provided'}</Typography>
              <Typography>{item.quantity}</Typography>
              <Typography>${item.rate}</Typography>
              <Typography>${item.amount || (item.quantity * item.rate)}</Typography>
            </Box>
          ))}
        </Box>

        <TextField
          fullWidth
          label="Notes - any relevant information not already covered"
          value={invoice.notes || ''}
          disabled
          multiline
          rows={4}
          variant="outlined"
          sx={{ bgcolor: '#374151', color: '#E5E7EB', mb: 2, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
        />

        <TextField
          fullWidth
          label="Terms and conditions - late fees, payment methods, delivery schedule"
          value={invoice.terms || ''}
          disabled
          multiline
          rows={4}
          variant="outlined"
          sx={{ bgcolor: '#374151', color: '#E5E7EB', mb: 2, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4, color: '#E5E7EB' }}>
          <Typography>Subtotal: ${invoice.subtotal.toFixed(2)}</Typography>
          <Typography>Tax: ${((invoice.subtotal * (invoice.tax / 100)) || 0).toFixed(2)}</Typography>
          <Typography>Discount: ${invoice.discount.toFixed(2)}</Typography>
          <Typography>Shipping: ${invoice.shipping.toFixed(2)}</Typography>
          <Typography>Total: ${invoice.total.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4, color: '#E5E7EB' }}>
          <Typography>Amount Paid: ${invoice.amountPaid.toFixed(2)}</Typography>
          <Typography>Balance Due: ${invoice.balanceDue.toFixed(2)}</Typography>
        </Box>

        <Button
          variant="contained"
          sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' }, mt: 2 }}
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          Share Invoice
        </Button>
      </Paper>
    </Box>
  );
}