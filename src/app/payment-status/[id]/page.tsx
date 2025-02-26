'use client';
import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { fetchInvoices } from '../../../utils/api';
import { Invoice, LineItem } from '@/types';
import Navbar from '../../../components/Navbar';

export default function PaymentStatus() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadInvoice = async () => {
      const invoices = await fetchInvoices();
      const foundInvoice = invoices.find((inv: Invoice) => inv.id === Number(id));
      setInvoice(foundInvoice || null);
      setLoading(false);
    };
    loadInvoice();
  }, [id]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0A0A0A' }}>
      <CircularProgress sx={{ color: '#4CAF50' }} />
    </Box>
  );

  if (!invoice) return <Typography>Not Found</Typography>;

  const calculateTotalAmount = (invoice: Invoice): number => {
    return invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const handlePayNow = () => {
    // Logic to process payment (e.g., redirect to payment gateway)
    alert(`Paying $${invoice.balanceDue.toFixed(2)} for Invoice #${invoice.id}`);
    router.push(`/invoice/${invoice.id}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#0A0A0A', p: 2 }}>
      <Navbar />
      <Paper sx={{ p: 4, mt: 2, bgcolor: '#1F2937', borderRadius: 2, boxShadow: 1, maxWidth: '600px', mx: 'auto', color: '#E5E7EB' }}>
        <Typography variant="h4" sx={{ color: '#4CAF50', mb: 4 }}>Payment Status</Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>Invoice #{invoice.id}</Typography>
        <Typography>Bill To: {invoice.billTo}</Typography>
        <Typography>Total Amount: ${calculateTotalAmount(invoice).toFixed(2)}</Typography>
        <Typography>Amount Paid: ${invoice.amountPaid.toFixed(2)}</Typography>
        <Typography>Balance Due: ${invoice.balanceDue.toFixed(2)}</Typography>
        <Typography>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</Typography>
        <Button
          variant="contained"
          onClick={handlePayNow}
          sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' }, mt: 4 }}
        >
          Pay Now
        </Button>
      </Paper>
    </Box>
  );
}