
'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { Box, Typography, Grid, Paper, Button, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { use } from 'react';

interface Item {
  item: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function InvoiceDetails({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const invoice = useSelector((state: RootState) =>
    state.invoices.invoices.find((inv) => inv.id === id)
  );

  if (!invoice) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            minHeight: 'calc(100vh - 64px)',
            background: 'linear-gradient(45deg, #1E3A8A, #7C3AED, #DB2777)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 4,
            borderRadius: '12px',
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: '#E5E7EB', textAlign: 'center' }}
          >
            Invoice not found.
          </Typography>
        </Box>
      </>
    );
  }

  const { customerName, items, total, dueDate, date } = invoice;

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
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            maxWidth: '900px',
            mx: 'auto',
            p: 4,
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '12px',
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Header */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#1E3A8A',
              textAlign: 'center',
              mb: 3,
            }}
          >
            Invoice #{id}
          </Typography>

          {/* Customer Info */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#6B7280' }}>
                Customer Name:
              </Typography>
              <Typography sx={{ color: '#1E3A8A' }}>{customerName}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ textAlign: { sm: 'right' } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#6B7280' }}>
                Date:
              </Typography>
              <Typography sx={{ color: '#1E3A8A' }}>{date}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#6B7280' }}>
                Due Date:
              </Typography>
              <Typography sx={{ color: '#1E3A8A' }}>{dueDate}</Typography>
            </Grid>
          </Grid>

          {/* Items */}
          <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#1E3A8A', mb: 2 }}>
            Items
          </Typography>
          <Box sx={{ mb: 4 }}>
            {items.length === 0 ? (
              <Grid container spacing={2} sx={{ py: 1 }}>
                <Grid item xs={5}>
                  <Typography sx={{ color: '#6B7280' }}>-</Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                  <Typography sx={{ color: '#6B7280' }}>0</Typography>
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                  <Typography sx={{ color: '#6B7280' }}>$0.00</Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'right' }}>
                  <Typography sx={{ color: '#6B7280' }}>$0.00</Typography>
                </Grid>
              </Grid>
            ) : (
              items.map((item, index) => (
                <Grid container spacing={2} key={index} sx={{ py: 1 }}>
                  <Grid item xs={5}>
                    <Typography sx={{ color: '#6B7280' }}>{item.item}</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: '#6B7280' }}>{item.quantity}</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: '#6B7280' }}>${item.rate.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={3} sx={{ textAlign: 'right' }}>
                    <Typography sx={{ color: '#6B7280' }}>${item.amount.toFixed(2)}</Typography>
                  </Grid>
                  {index < items.length - 1 && <Divider sx={{ width: '100%', my: 1 }} />}
                </Grid>
              ))
            )}
          </Box>

          {/* Totals */}
          <Box sx={{ maxWidth: 400, ml: 'auto' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography sx={{ color: '#6B7280' }}>Subtotal:</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography sx={{ color: '#1E3A8A' }}>
                  ${items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 'bold', color: '#1E3A8A', textAlign: 'right' }}
                >
                  Total: ${total.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="outlined"
              onClick={() => router.push('/all-invoices')}
              sx={{
                borderColor: '#F59E0B',
                color: '#F59E0B',
                borderRadius: '8px',
                padding: '8px 24px',
                textTransform: 'uppercase',
                '&:hover': { borderColor: '#D97706', color: '#D97706' },
              }}
            >
              Back to All Invoices
            </Button>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              onClick={() => router.push(`/create-invoice?edit=${id}`)}
              sx={{
                background: 'linear-gradient(90deg, #EF4444, #F59E0B)', // Reversed gradient for contrast
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '8px',
                padding: '8px 24px',
                textTransform: 'uppercase',
                '&:hover': { background: 'linear-gradient(90deg, #DC2626, #D97706)' },
              }}
            >
              Edit Invoice
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}