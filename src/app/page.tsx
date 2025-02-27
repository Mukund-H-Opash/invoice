'use client';
import { Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';


export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex', // Removed height: '100vh' to let layout control it
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #1E3A8A, #7C3AED, #DB2777)',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '100vh', // Adjust for typical navbar height
        border:'none',
      }}
    >
      <Box
        component={motion.div}
        initial={{ scale: 0, opacity: 0.3 }}
        animate={{ scale: 1.5, opacity: 0.1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, #9333EA, transparent)',
          top: '10%',
          left: '15%',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        initial={{ scale: 0, opacity: 0.3 }}
        animate={{ scale: 1.8, opacity: 0.1 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, #EC4899, transparent)',
          bottom: '5%',
          right: '10%',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box sx={{ zIndex: 1, textAlign: 'center', px: 2 }}>
        <Typography
          variant="h1"
          component={motion.h1}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          sx={{
            fontSize: { xs: '2.5rem', sm: '4rem', md: '6rem' },
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
            mb: 2,
          }}
        >
          Invoice Maker
        </Typography>
        <Typography
          variant="h5"
          component={motion.p}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          sx={{
            fontSize: { xs: '1rem', sm: '1.5rem' },
            color: '#E5E7EB',
            maxWidth: '600px',
            mx: 'auto',
            mb: 4,
          }}
        >
          Craft stunning invoices in seconds with a splash of creativity!
        </Typography>
        <Button
          component={motion.button}
          whileHover={{ scale: 1.05, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)' }}
          whileTap={{ scale: 0.95 }}
          variant="contained"
          size="large"
          onClick={() => router.push('/create-invoice')}
          sx={{
            background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
            color: '#fff',
            fontSize: { xs: '1rem', md: '1.25rem' },
            fontWeight: 'bold',
            padding: '12px 36px',
            borderRadius: '50px',
            textTransform: 'none',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              background: 'linear-gradient(90deg, #D97706, #DC2626)',
            },
          }}
        >
          Enter Now
        </Button>
      </Box>
    </Box>
  );
}