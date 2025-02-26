'use client';
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
}