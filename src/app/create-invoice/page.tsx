'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import InvoiceForm from '../../components/InvoiceForm';
import InvoiceList from '../../components/InvoiceList';
import { addInvoice, updateInvoice } from '../../redux/invoiceSlice';
import { createInvoice, fetchInvoices, updateInvoice as updateApiInvoice } from '../../utils/api';
import { Invoice, LineItem } from '@/types';
import Navbar from '../../components/Navbar';

export default function CreateInvoice() {
  const dispatch = useDispatch();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadInvoices = async () => {
      const data = await fetchInvoices();
      setInvoices(data);
    };
    loadInvoices();

    const editId = searchParams.get('edit');
    if (editId) {
      const invoiceToEdit = invoices.find((inv) => inv.id === Number(editId));
      if (invoiceToEdit) setEditingInvoice(invoiceToEdit);
      else setEditingInvoice(null);
    }
  }, [searchParams]);

  const handleSubmit = async (invoice: Invoice) => {
    const newInvoice = {
      ...invoice,
      date: new Date().toISOString(),
    }; // Removed logo field
    try {
      if (editingInvoice) {
        const updatedInvoice = await updateApiInvoice(editingInvoice.id!, newInvoice);
        dispatch(updateInvoice(updatedInvoice));
        setSnackbarMessage('Invoice updated successfully!');
      } else {
        const savedInvoice = await createInvoice(newInvoice);
        dispatch(addInvoice(savedInvoice));
        setSnackbarMessage('Invoice created successfully!');
      }
      setOpenSnackbar(true);
      setEditingInvoice(null);
      const updatedInvoices = await fetchInvoices();
      setInvoices(updatedInvoices);
    } catch (error) {
      setSnackbarMessage('Error saving invoice!');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#0A0A0A', p: 2 }}>
      <Navbar />
      <Box sx={{ mt: 2, p: 2, bgcolor: '#1F2937', borderRadius: 2, boxShadow: 1, color: '#E5E7EB' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#4CAF50' }}>
          {editingInvoice ? 'Edit Invoice' : 'Create Invoice'}
        </Typography>
        <InvoiceForm onSubmit={handleSubmit} initialData={editingInvoice} />
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#4CAF50' }}>
            Recent Invoices
          </Typography>
          <InvoiceList invoices={invoices} onDeleteSuccess={() => setSnackbarMessage('Invoice deleted successfully!')} />
        </Box>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', bgcolor: '#1F2937', color: '#E5E7' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}