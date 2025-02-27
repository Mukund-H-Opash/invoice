// 'use client';
// import { useDispatch, useSelector } from 'react-redux';
// import { setInvoices } from '@/redux/invoiceSlice';
// import { fetchInvoices } from '@/utils/api';
// import { useEffect } from 'react';
// import { RootState } from '@/redux/store';
// import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
// import { motion } from 'framer-motion';
// import { useRouter } from 'next/navigation';
// import Navbar from '@/components/Navbar';

// const AllInvoices = () => {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const invoices = useSelector((state: RootState) => state.invoices.invoices);

//   useEffect(() => {
//     const loadInvoices = async () => {
//       const data = await fetchInvoices();
//       dispatch(setInvoices(data));
//     };
//     loadInvoices();
//   }, [dispatch]);

//   return (
//     <>
//     <Navbar/>
//     <Box
//       sx={{
//         minHeight: 'calc(100vh - 64px)', // Adjust for navbar height
//         background: 'linear-gradient(45deg, #1E3A8A, #7C3AED, #DB2777)', // Matching app theme
//         p: 4,
//       }}
//     >
//       <Typography
//         variant="h3"
//         sx={{
//           fontWeight: 'bold',
//           color: '#fff',
//           textAlign: 'center',
//           mb: 4,
//           textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
//         }}
//       >
//         All Invoices
//       </Typography>

//       {invoices.length === 0 ? (
//         <Typography
//           variant="h6"
//           sx={{ color: '#E5E7EB', textAlign: 'center', mt: 4 }}
//         >
//           No invoices found. Create one to get started!
//         </Typography>
//       ) : (
//         <Grid container spacing={3}>
//           {invoices.map((invoice) => (
//             <Grid item xs={12} sm={6} md={4} key={invoice.id}>
//               <Card
//                 component={motion.div}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 sx={{
//                   background: 'rgba(255, 255, 255, 0.95)',
//                   borderRadius: '12px',
//                   boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
//                   overflow: 'hidden',
//                   '&:hover': {
//                     boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.25)',
//                   },
//                 }}
//               >
//                 <CardContent>
//                   <Typography
//                     variant="h6"
//                     sx={{ fontWeight: 'bold', color: '#1E3A8A' }}
//                   >
//                     Invoice #{invoice.id}
//                   </Typography>
//                   <Typography sx={{ color: '#6B7280', mb: 1 }}>
//                     Customer: {invoice.customerName}
//                   </Typography>
//                   <Typography sx={{ color: '#6B7280', mb: 1 }}>
//                     Due Date: {invoice.dueDate}
//                   </Typography>
//                   <Typography sx={{ color: '#6B7280', mb: 2 }}>
//                     Total: ${Number(invoice.amount).toFixed(2)}
//                   </Typography>
//                   <Button
//                     component={motion.button}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     variant="contained"
//                     onClick={() => router.push(`/invoice/${invoice.id}`)}
//                     sx={{
//                       background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
//                       color: '#fff',
//                       fontWeight: 'bold',
//                       borderRadius: '8px',
//                       padding: '8px 16px',
//                       '&:hover': {
//                         background: 'linear-gradient(90deg, #D97706, #DC2626)',
//                       },
//                     }}
//                   >
//                     View Details
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Box>
//     </>
    
//   );
// };

// export default AllInvoices;


'use client';
import { useDispatch, useSelector } from 'react-redux';
import { setInvoices, deleteInvoice } from '@/redux/invoiceSlice';
import { fetchInvoices, deleteInvoice as deleteApiInvoice } from '@/utils/api';
import { useEffect } from 'react';
import { RootState } from '@/redux/store';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { toast } from 'react-toastify';

const AllInvoices = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const invoices = useSelector((state: RootState) => state.invoices.invoices);

  useEffect(() => {
    const loadInvoices = async () => {
      const data = await fetchInvoices();
      dispatch(setInvoices(data));
    };
    loadInvoices();
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteApiInvoice(id);
      if (success) {
        dispatch(deleteInvoice(id));
        toast.success('Invoice deleted successfully!');
      } else {
        toast.error('Failed to delete invoice!');
      }
    } catch (error) {
      toast.error('Error deleting invoice!');
      console.error('Error deleting invoice:', error);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          background: 'linear-gradient(45deg, #1E3A8A, #7C3AED, #DB2777)',
          p: 4,
          borderRadius: '12px',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
            mb: 4,
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          All Invoices
        </Typography>

        {invoices.length === 0 ? (
          <Typography
            variant="h6"
            sx={{ color: '#E5E7EB', textAlign: 'center', mt: 4 }}
          >
            No invoices found. Create one to get started!
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {invoices.map((invoice) => (
              <Grid item xs={12} sm={6} md={4} key={invoice.id}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.25)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 'bold', color: '#1E3A8A' }}
                    >
                      Invoice #{invoice.id}
                    </Typography>
                    <Typography sx={{ color: '#6B7280', mb: 1 }}>
                      Customer: {invoice.customerName}
                    </Typography>
                    <Typography sx={{ color: '#6B7280', mb: 1 }}>
                      Due Date: {invoice.dueDate}
                    </Typography>
                    <Typography sx={{ color: '#6B7280', mb: 2 }}>
                      Total: ${Number(invoice.amount).toFixed(2)}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        variant="contained"
                        onClick={() => router.push(`/invoice/${invoice.id}`)}
                        sx={{
                          background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
                          color: '#fff',
                          fontWeight: 'bold',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #D97706, #DC2626)',
                          },
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        component={motion.button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        variant="outlined"
                        onClick={() => handleDelete(invoice.id)}
                        sx={{
                          borderColor: '#EF4444',
                          color: '#EF4444',
                          fontWeight: 'bold',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          '&:hover': {
                            borderColor: '#DC2626',
                            color: '#DC2626',
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </>
  );
};

export default AllInvoices;