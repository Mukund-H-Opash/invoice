MY-INVOICE-APP/
├── next/                    # Next.js build output (auto-generated)
├── node_modules/            # Project dependencies (installed via npm/yarn)
├── public/                  # Static assets (e.g., images, favicon)
├── src/                     # Source code
│   ├── app/                 # Next.js app directory (file-based routing)
│   │   ├── all-invoices/    # Route for listing all invoices
│   │   │   └── page.tsx     # Page component for the invoices list
│   │   ├── create-invoice/  # Route for creating a new invoice
│   │   │   └── page.tsx     # Page component for creating an invoice
│   │   ├── invoice    
│   │   │   └──[id]    # Dynamic route for individual invoice details 
│   │   │       └── page.tsx    # Page component for a specific invoice
│   │   ├── globals.css      # Global CSS styles
│   │   ├── layout.tsx       # Shared layout component for the app
│   │   └── page.tsx         # Default page or root route component
│   ├── components/          # Reusable UI components
│   │   ├── InvoiceForm.tsx  # Component for invoice creation/editing
│   │   ├── InvoiceList.tsx  # Component for displaying a list of invoices
│   │   └── Navbar.tsx       # Navigation bar component
│   ├── redux/               # Redux state management
│   │   ├── invoiceSlice.ts  # Redux slice for invoice state
│   │   ├── provider.ts      # Redux provider setup
│   │   └── store.ts         # Redux store configuration
│   ├── types/               # General TypeScript types for the app
│   │   └── index.ts         # Type definitions export
│   ├── utils/               # Utility functions
│       └── api.ts           # API utility functions
├── db.json                  # JSON-based database (e.g., for mocking APIs)


src/app/page.tsx ('use client';
import { Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1E3A8A, #0A0A0A)',
        color: '#fff',
        textAlign: 'center',
        padding: 2,
      }}
    >
      <Typography variant="h1" gutterBottom sx={{ fontSize: { xs: '2rem', md: '4rem' }, fontWeight: 'bold' }}>
        Welcome to Invoice Maker
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ mb: 4, color: '#D1D5DB' }}>
        Create, manage, and track professional invoices with ease
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{
          backgroundColor: '#4CAF50',
          '&:hover': { backgroundColor: '#45a049' },
          padding: '12px 24px',
          borderRadius: 2,
          fontSize: '1.2rem',
        }}
        onClick={() => router.push('/create-invoice')} // Changed to /create-invoice
      >
        Get Started
      </Button>
    </Box>
  );
})
src/app/layout.tsx (
  import { Box } from '@mui/material';
import { Providers } from '../redux/provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ 
        backgroundColor: '#0A0A0A',
        color: '#E5E7EB',
        margin: 0,
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
      }}>
        <Providers>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ flex: 1, p: 2 }}>{children}</Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
)
app/globals.css (
  @tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0A0A0A;
  --foreground: #E5E7EB;
  --primary: #1E3A8A;
  --accent: #4CAF50;
  --error: #f44336;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0A0A0A;
    --foreground: #E5E7EB;
  }
}
@font-face {
  font-family: 'Inter';
  src: url('/Static/Inter-VariableFont_slnt,wght.ttf') format('truetype');
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 0;
}

.MuiPaper-root {
  background-color: #1F2937 !important;
}

.MuiButton-contained {
  background-color: var(--accent) !important;
  color: #fff !important;
}

.MuiButton-contained:hover {
  background-color: #45a049 !important;
}

.MuiButton-containedSecondary {
  background-color: var(--primary) !important;
  color: #fff !important;
}

.MuiButton-containedSecondary:hover {
  background-color: #152e63 !important;
}

.MuiInputBase-input, .MuiInputLabel-root {
  color: #E5E7EB !important;
}

.MuiOutlinedInput-root {
  bgcolor: #374151 !important;
}
)

app/all-invoices/page.tsx (
  'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, MenuItem, Button, List, ListItem, ListItemText, Snackbar, Alert, Grid } from '@mui/material';
import { setInvoices } from '../../redux/invoiceSlice';
import { fetchInvoices } from '../../utils/api';
import { Invoice, LineItem } from '@/types';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function AllInvoices() {
  const dispatch = useDispatch();
  const [invoices, setLocalInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const loadInvoices = async () => {
      const data = await fetchInvoices();
      dispatch(setInvoices(data));
      setLocalInvoices(data);
    };
    loadInvoices();
  }, [dispatch]);

  const calculateTotalAmount = (invoice: Invoice): number => {
    return invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const filteredAndSortedInvoices = invoices
    .filter((invoice) =>
      invoice.billTo.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterPayment ? invoice.paymentTerms === filterPayment : true)
    )
    .sort((a, b) => 
      sortOrder === 'asc' ? calculateTotalAmount(a) - calculateTotalAmount(b) : calculateTotalAmount(b) - calculateTotalAmount(a)
    );

  const handleDeleteSuccess = () => {
    setSnackbarMessage('Invoice deleted successfully!');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#0A0A0A', p: 2 }}>
      <Navbar />
      <Box sx={{ mt: 2, p: 2, bgcolor: '#1F2937', borderRadius: 2, boxShadow: 1, color: '#E5E7EB' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#4CAF50' }}>
          All Invoices
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search by Bill To"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ bgcolor: '#374151', color: '#E5E7EB', width: '100%' }}
              InputProps={{ style: { color: '#E5E7EB' } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Filter by Payment Terms"
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              sx={{ bgcolor: '#374151', color: '#E5E7EB', width: '100%' }}
              InputProps={{ style: { color: '#E5E7EB' } }}
            >
              <MenuItem value="">All</MenuItem>
              {['Due on Receipt', 'Net 30', 'Net 60'].map((option) => (
                <MenuItem key={option} value={option} sx={{ color: '#0A0A0A' }}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Sort by Total Amount"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              sx={{ bgcolor: '#374151', color: '#E5E7EB', width: '100%' }}
              InputProps={{ style: { color: '#E5E7EB' } }}
            >
              <MenuItem value="asc" sx={{ color: '#0A0A0A' }}>Ascending</MenuItem>
              <MenuItem value="desc" sx={{ color: '#0A0A0A' }}>Descending</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <List>
          {filteredAndSortedInvoices.map((invoice) => (
            <ListItem key={invoice.id} sx={{ bgcolor: '#1F2937', mb: 1, borderRadius: 2, boxShadow: 1 }}>
              <ListItemText
                primary={`${invoice.billTo} - $${calculateTotalAmount(invoice).toFixed(2)}`}
                secondary={`Due: ${new Date(invoice.dueDate).toLocaleDateString()}, Terms: ${invoice.paymentTerms}`}
              />
              <Button component={Link} href={`/invoice/${invoice.id}`} sx={{ mr: 2, backgroundColor: '#4CAF50', color: '#fff', '&:hover': { backgroundColor: '#45a049' }}}>
                View More Details
              </Button>
              <Button component={Link} href={`/create-invoice?edit=${invoice.id}`} sx={{ mr: 2, backgroundColor: '#1E3A8A', color: '#fff', '&:hover': { backgroundColor: '#152e63' }}}>
                Edit
              </Button>
              <Button onClick={() => handleDeleteSuccess()} sx={{ backgroundColor: '#f44336', color: '#fff', '&:hover': { backgroundColor: '#da190b' }}}>
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', bgcolor: '#1F2937', color: '#E5E7EB' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
)

app/create-invoice/page.tsx (
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
)

app/invoice/[id]/page.tsx (
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
})

app/payment-status/[id]/page.tsx (
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
)



src/components/Navbar.tsx
(
  'use client';
import { Button, Stack, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ bgcolor: '#1E3297' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#E5E7EB' }}>
          Invoice Maker
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="text" component={Link} href="/" sx={{ color: '#E5E7EB', '&:hover': { color: '#4CAF50' }}}>
            Home
          </Button>
          <Button variant="text" component={Link} href="/create-invoice" sx={{ color: '#E5E7EB', '&:hover': { color: '#4CAF50' }}}>
            Create Invoice
          </Button>
          <Button variant="text" component={Link} href="/all-invoices" sx={{ color: '#E5E7EB', '&:hover': { color: '#4CAF50' }}}>
            All Invoices
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
)

sec/components/invoiceList.tsx
(
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

)


src/components/InvoiceForm.tsx(
  import { useState } from 'react';
import { Button, TextField, MenuItem, Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Invoice, LineItem } from '../types';

interface InvoiceFormProps {
  onSubmit: (invoice: Invoice) => void;
  initialData?: Invoice | null;
}

export default function InvoiceForm({ onSubmit, initialData }: InvoiceFormProps) {
  const [formData, setFormData] = useState<Invoice>(
    initialData || {
      from: '',
      billTo: '',
      shipTo: '',
      paymentTerms: 'Due on Receipt',
      dueDate: new Date().toISOString().split('T')[0],
      poNumber: '',
      lineItems: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      notes: '',
      terms: '',
      subtotal: 0,
      tax: 0,
      discount: 0,
      shipping: 0,
      total: 0,
      amountPaid: 0,
      balanceDue: 0,
      date: new Date().toISOString().split('T')[0],
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLineItemChange = (index: number, field: keyof LineItem, value: string | number) => {
    setFormData((prev) => {
      const newLineItems = [...prev.lineItems];
      newLineItems[index] = {
        ...newLineItems[index],
        [field]: field === 'description' ? value as string : Number(value),
      };
      return calculateTotals({ ...prev, lineItems: newLineItems });
    });
  };

  const addLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }],
    }));
  };

  const removeLineItem = (index: number) => {
    setFormData((prev) => {
      const newLineItems = prev.lineItems.filter((_, i) => i !== index);
      return calculateTotals({ ...prev, lineItems: newLineItems });
    });
  };

  const calculateTotals = (invoice: Invoice): Invoice => {
    const subtotal = invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxAmount = (subtotal * (invoice.tax / 100)) || 0;
    const total = subtotal + taxAmount + invoice.shipping - invoice.discount;
    const balanceDue = total - invoice.amountPaid;

    return {
      ...invoice,
      subtotal,
      total,
      balanceDue,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // No logo field anymore
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2, bgcolor: '#1F2937', borderRadius: 2, boxShadow: 1, color: '#E5E7EB' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: 1, textAlign: 'right' }}>
            <Typography variant="h5" sx={{ color: '#4CAF50' }}>INVOICE</Typography>
            <TextField
              fullWidth
              label="Invoice #"
              value={formData.id || 1}
              disabled
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', mt: 1, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
          </Box>
        </Box>

        <TextField
          label="Who is this from?"
          name="from"
          value={formData.from}
          onChange={handleChange}
          required
          variant="outlined"
          sx={{ bgcolor: '#374151', color: '#E5E7EB', '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Bill To"
            name="billTo"
            value={formData.billTo}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', flex: 1, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Ship To (optional)"
            name="shipTo"
            value={formData.shipTo || ''}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', flex: 1, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date.split('T')[0]}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', flex: 1, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Payment Terms"
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', flex: 1, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', flex: 1, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="PO Number (optional)"
            name="poNumber"
            value={formData.poNumber || ''}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: '#374159', color: '#E5E7EB', flex: 1, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
        </Box>

        <Box sx={{ bgcolor: '#1E3A8A', color: '#E5E7EB', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="subtitle1">Item</Typography>
        </Box>
        {formData.lineItems.map((item, index) => (
          <Box key={index} sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 0.5fr', gap: 2, alignItems: 'center', bgcolor: '#374151', p: 2, borderRadius: 1, color: '#E5E7EB' }}>
            <TextField
              label="Description of Item/Service"
              value={item.description}
              onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <TextField
              type="number"
              label="Quantity"
              value={item.quantity}
              onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <TextField
              type="number"
              label="Rate"
              value={item.rate}
              onChange={(e) => handleLineItemChange(index, 'rate', e.target.value)}
              variant="outlined"
              sx={{ bgcolor: '#374151', color: '#E5E7EB', '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <TextField
              type="number"
              label="Amount"
              value={item.amount || (item.quantity * item.rate)}
              onChange={(e) => handleLineItemChange(index, 'amount', e.target.value)}
              variant="outlined"
              disabled
              sx={{ bgcolor: '#374151', color: '#E5E7EB', '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
            />
            <IconButton onClick={() => removeLineItem(index)} color="error" sx={{ color: '#f44336' }}>
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          onClick={addLineItem}
          variant="contained"
          sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' }, mt: 2 }}
          startIcon={<AddIcon />}
        >
          Add Line
        </Button>

        <TextField
          label="Notes - any relevant information not already covered"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          multiline
          rows={4}
          variant="outlined"
          sx={{ bgcolor: '#374151', color: '#E5E7EB', mt: 2, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
        />

        <TextField
          label="Terms and conditions - late fees, payment methods, delivery schedule"
          name="terms"
          value={formData.terms || ''}
          onChange={handleChange}
          multiline
          rows={4}
          variant="outlined"
          sx={{ bgcolor: '#374151', color: '#E5E7EB', mt: 2, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, color: '#E5E7EB' }}>
          <TextField
            label="Subtotal"
            name="subtotal"
            type="number"
            value={formData.subtotal}
            onChange={handleChange}
            disabled
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Tax (%)"
            name="tax"
            type="number"
            value={formData.tax}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Discount"
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Shipping"
            name="shipping"
            type="number"
            value={formData.shipping}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Total"
            name="total"
            type="number"
            value={formData.total}
            onChange={handleChange}
            disabled
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, color: '#E5E7EB' }}>
          <TextField
            label="Amount Paid"
            name="amountPaid"
            type="number"
            value={formData.amountPaid}
            onChange={handleChange}
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
          <TextField
            label="Balance Due"
            name="balanceDue"
            type="number"
            value={formData.balanceDue}
            onChange={handleChange}
            disabled
            variant="outlined"
            sx={{ bgcolor: '#374151', color: '#E5E7EB', width: 150, '& .MuiInputBase-input': { color: '#E5E7EB' }, '& .MuiInputLabel-root': { color: '#A0AEC0' } }}
          />
        </Box>

        <Button type="submit" variant="contained" sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' }, mt: 4, width: '100%' }}>
          Create
        </Button>
      </Box>
    </form>
  );
}
)

reducx/invoiceSlice.ts(
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
)

provider.tsx(
  'use client'; // Client component for Next.js

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
)

store.ts(
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
)
types/index.ts(
  export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
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
)

utils/api.ts(
  import { Invoice } from '@/types';
import axios from 'axios';

const API_URL = 'http://localhost:3001/invoices';

export const fetchInvoices = async () => (await axios.get(API_URL)).data;
export const createInvoice = async (invoice: Invoice) => (await axios.post(API_URL, invoice)).data;
export const updateInvoice = async (id: number, invoice: Invoice) =>
  (await axios.put(`${API_URL}/${id}`, invoice)).data;
export const deleteInvoice = async (id: number) => await axios.delete(`${API_URL}/${id}`);
)