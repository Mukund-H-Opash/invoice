// 'use client';
// import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { Box, Typography, TextField, MenuItem, Button, List, ListItem, ListItemText, Snackbar, Alert, Grid } from '@mui/material';
// import { setInvoices } from '../../redux/invoiceSlice';
// import { fetchInvoices } from '../../utils/api';
// import { Invoice } from '@/types';
// import Link from 'next/link';
// import Navbar from '../../components/Navbar';

// export default function AllInvoices() {
//   const dispatch = useDispatch();
//   const [invoices, setLocalInvoices] = useState<Invoice[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');

//   useEffect(() => {
//     const loadInvoices = async () => {
//       try {
//         const data = await fetchInvoices();
//         console.log('Fetched invoices:', data); // Debug log to inspect data
//         dispatch(setInvoices(data));
//         setLocalInvoices(data);
//       } catch (error) {
//         console.error('Error fetching invoices:', error);
//       }
//     };
//     loadInvoices();
//   }, [dispatch]);

//   const calculateTotalAmount = (invoice: Invoice): number => {
//     const subtotal = invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
//     const taxAmount = (subtotal * (invoice.tax / 100)) || 0;
//     return subtotal + taxAmount + invoice.shipping - invoice.discount;
//   };

//   const filteredAndSortedInvoices = invoices
//     .filter((invoice) => {
//       // Safeguard: Check if name exists and is a string, fallback to empty string if not
//       const name = invoice.name || '';
//       return name.toLowerCase().includes(searchTerm.toLowerCase());
//     })
//     .sort((a, b) => (sortOrder === 'asc' ? calculateTotalAmount(a) - calculateTotalAmount(b) : calculateTotalAmount(b) - calculateTotalAmount(a)));

//   const handleDeleteSuccess = () => {
//     setSnackbarMessage('Invoice deleted successfully!');
//     setOpenSnackbar(true);
//   };

//   const handleCloseSnackbar = () => setOpenSnackbar(false);

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#000000', p: 2 }}>
//       <Navbar />
//       <Box sx={{ mt: 2, p: 2, bgcolor: '#1F2937', borderRadius: 2, color: '#1F2937' }}>
//         <Typography variant="h4" gutterBottom sx={{ color: '#FEF9E1' }}>
//           All Invoices
//         </Typography>
//         <Grid container spacing={2} sx={{ mb: 4 }}>
//           <Grid item xs={12} md={6}>
//             <TextField
//               label="Search by Name"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               sx={{
//                 bgcolor: '#E5D0AC',
//                 width: '100%',
//                 '& .MuiInputBase-input': { color: '#000000' },
//                 '& .MuiInputLabel-root': { color: '#F7F7F7' }, // Label color white
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <TextField
//               select
//               label="Sort by Total Amount"
//               value={sortOrder}
//               onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
//               sx={{
//                 bgcolor: '#E5D0AC',
//                 width: '100%',
//                 '& .MuiInputBase-input': { color: '#000000' },
//                 '& .MuiInputLabel-root': { color: '#F7F7F7' }, // Label color white
//               }}
//             >
//               <MenuItem value="asc" sx={{ color: '#000000' }}>Ascending</MenuItem>
//               <MenuItem value="desc" sx={{ color: '#000000' }}>Descending</MenuItem>
//             </TextField>
//           </Grid>
//         </Grid>
//         <List>
//           {filteredAndSortedInvoices.map((invoice) => (
//             <ListItem key={invoice.id} sx={{ bgcolor: '#1F2937', mb: 1, borderRadius: 2 }}>
//               <ListItemText
//                 primary={`${invoice.name || 'Unnamed'} - $${calculateTotalAmount(invoice).toFixed(2)}`}
//                 secondary={`Company: ${invoice.companyName || 'N/A'}, Date: ${new Date(invoice.date).toLocaleDateString()}`}
//                 sx={{ color: '#F7F7F7' }}
//               />
//               <Button
//                 component={Link}
//                 href={`/invoice/${invoice.id}`}
//                 sx={{ mr: 2, bgcolor: '#FFB22C', '&:hover': { bgcolor: '#' }, color: '#000000' }}
//               >
//                 View
//               </Button>
//               <Button
//                 component={Link}
//                 href={`/create-invoice?edit=${invoice.id}`}
//                 sx={{ mr: 2, bgcolor: '#FFB22C', '&:hover': { bgcolor: '#1F2937' }, color: '#000000' }}
//               >
//                 Edit
//               </Button>
//               <Button
//                 onClick={handleDeleteSuccess}
//                 sx={{ bgcolor: '#FF9D23', '&:hover': { bgcolor: '#1F2937' }, color: '#000000' }}
//               >
//                 Delete
//               </Button>
//             </ListItem>
//           ))}
//         </List>
//       </Box>
//       <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
//         <Alert severity="success" sx={{ bgcolor: '#1F2937', color: '#F7F7F7' }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }




'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, TextField, MenuItem, Button, List, ListItem, ListItemText, Snackbar, Alert, Grid } from '@mui/material';
import { setInvoices } from '../../redux/invoiceSlice';
import { fetchInvoices } from '../../utils/api';
import { Invoice } from '@/types';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function AllInvoices() {
  const dispatch = useDispatch();
  const [invoices, setLocalInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await fetchInvoices();
        console.log('Fetched invoices:', data); // Debug log to inspect data
        dispatch(setInvoices(data));
        setLocalInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    };
    loadInvoices();
  }, [dispatch]);

  const calculateTotalAmount = (invoice: Invoice): number => {
    const subtotal = invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const taxAmount = (subtotal * (invoice.tax / 100)) || 0;
    return subtotal + taxAmount + invoice.shipping - invoice.discount;
  };

  const filteredAndSortedInvoices = invoices
    .filter((invoice) => {
      const name = invoice.name || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => (sortOrder === 'asc' ? calculateTotalAmount(a) - calculateTotalAmount(b) : calculateTotalAmount(b) - calculateTotalAmount(a)));

  const handleDeleteSuccess = () => {
    setSnackbarMessage('Invoice deleted successfully!');
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#1F2937', p: 2 }}>
      <Navbar />
      <Box sx={{ mt: 2, p: 2, bgcolor: '#1F2937', borderRadius: 2, color: '#E5E7EB' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#4CAF50' }}>
          All Invoices
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Search by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                bgcolor: '#374151',
                width: '100%',
                '& .MuiInputBase-input': { color: '#E5E7EB' },
                '& .MuiInputLabel-root': { color: '#A0AEC0' }, // Label color from InvoiceForm
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Sort by Total Amount"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              sx={{
                bgcolor: '#374151',
                width: '100%',
                '& .MuiInputBase-input': { color: '#E5E7EB' },
                '& .MuiInputLabel-root': { color: '#A0AEC0' }, // Label color from InvoiceForm
              }}
            >
              <MenuItem value="asc" sx={{ color: '#E5E7EB' }}>Ascending</MenuItem>
              <MenuItem value="desc" sx={{ color: '#E5E7EB' }}>Descending</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <List>
          {filteredAndSortedInvoices.map((invoice) => (
            <ListItem key={invoice.id} sx={{ bgcolor: '#374151', mb: 1, borderRadius: 2 }}>
              <ListItemText
                primary={`${invoice.name || 'Unnamed'} - $${calculateTotalAmount(invoice).toFixed(2)}`}
                secondary={`Company: ${invoice.companyName || 'N/A'}, Date: ${new Date(invoice.date).toLocaleDateString()}`}
                sx={{ color: '#E5E7EB' }}
              />
              <Button
                component={Link}
                href={`/invoice/${invoice.id}`}
                sx={{ mr: 2, bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' }, color: '#E5E7EB' }}
              >
                View
              </Button>
              <Button
                component={Link}
                href={`/create-invoice?edit=${invoice.id}`}
                sx={{ mr: 2, bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' }, color: '#E5E7EB' }}
              >
                Edit
              </Button>
              <Button
                onClick={handleDeleteSuccess}
                sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#da190b' }, color: '#E5E7EB' }}
              >
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert severity="success" sx={{ bgcolor: '#374151', color: '#E5E7EB' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}